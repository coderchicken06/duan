package com.example.carstore.service;

import com.example.carstore.entity.Account;
import com.example.carstore.entity.Car;
import com.example.carstore.entity.Contract;
import com.example.carstore.entity.OrderDetail;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.PaymentTransaction;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.ContractRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.PaymentTransactionRepository;
import com.example.carstore.util.OrderStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PaymentTransactionService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentTransactionService.class);
    private static final long PAYMENT_TIMEOUT_MILLIS = 3 * 60 * 1000L;
    private static final String CARSTORE_ACCOUNT_NUMBER = "102880629915";

    // Hỗ trợ linh hoạt các biến thể như: VELOR5, VELORA-5, VELOR-5, velora3,...
    private static final Pattern ORDER_CODE_PATTERN = Pattern.compile("(?i)VELOR[A-Z-]*(\\d+)");

    private final PaymentTransactionRepository repo;
    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final CarRepository carRepo;
    private final ContractRepository contractRepo;
    private final AccountRepository accountRepo;
    private final MailService mailService;
    private final ObjectMapper objectMapper;

    @Value("${sepay.merchant-id:}")
    private String merchantId;

    @Value("${sepay.secret-key:}")
    private String secretKey;

    @Value("${sepay.checkout-url:https://pay-sandbox.sepay.vn/v1/checkout/init}")
    private String checkoutUrl;

    public PaymentTransactionService(PaymentTransactionRepository repo,
            OrderRepository orderRepo,
            OrderDetailRepository detailRepo,
            CarRepository carRepo,
            ContractRepository contractRepo,
            AccountRepository accountRepo,
            MailService mailService,
            ObjectMapper objectMapper) {
        this.repo = repo;
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.carRepo = carRepo;
        this.contractRepo = contractRepo;
        this.accountRepo = accountRepo;
        this.mailService = mailService;
        this.objectMapper = objectMapper;
    }

    public List<PaymentTransaction> byOrder(Integer orderId) {
        return repo.findByOrderIdOrderByPaidAtDesc(orderId);
    }

    @Transactional
    public PaymentTransaction recordSuccessfulDeposit(Orders order, String gateway) {
        String transactionNo = "PAY-" + order.getId() + "-" + order.getDepositPaidAt().getTime();
        if (repo.existsByTransactionNo(transactionNo)) {
            throw new IllegalArgumentException("Giao dịch đã được ghi nhận.");
        }
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setOrderId(order.getId());
        transaction.setGateway(gateway);
        transaction.setTransactionNo(transactionNo);
        transaction.setAmount(order.getDepositAmount());
        transaction.setStatus("SUCCESS");
        transaction.setResponseCode("00");
        transaction.setPaidAt(order.getDepositPaidAt());
        return repo.save(transaction);
    }

    public Map<String, Object> createQr(Orders order) {
        if (OrderStatus.CANCELLED.equals(order.getStatus())
                || OrderStatus.DELIVERED.equals(order.getStatus())) {
            throw new IllegalArgumentException("Không thể thanh toán đơn hàng đã kết thúc.");
        }
        if (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())) {
            throw new IllegalArgumentException("Đơn hàng đã được thanh toán.");
        }

        double amount = paymentAmount(order);
        if (amount <= 0) {
            throw new IllegalArgumentException("Đơn hàng không có giá trị hợp lệ.");
        }

        try {
            long finalAmount = Math.round(amount);
            String des = "SEVQR VELOR" + order.getId();

            String qrUrl = "https://vietqr.app/img?"
                    + "bank=" + java.net.URLEncoder.encode("VietinBank", StandardCharsets.UTF_8)
                    + "&acc=" + java.net.URLEncoder.encode(CARSTORE_ACCOUNT_NUMBER, StandardCharsets.UTF_8)
                    + "&amount=" + finalAmount
                    + "&des=" + java.net.URLEncoder.encode(des, StandardCharsets.UTF_8)
                    + "&template=" + java.net.URLEncoder.encode("compact", StandardCharsets.UTF_8);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("qrUrl", qrUrl);
            result.put("orderCode", "VELOR" + order.getId());
            result.put("amount", finalAmount);

            return result;

        } catch (Exception exception) {
            throw new IllegalStateException("Không thể tạo mã VietQR.", exception);
        }
    }

    public boolean isSePayConfigured() {
        return merchantId != null && !merchantId.isBlank()
                && secretKey != null && !secretKey.isBlank()
                && checkoutUrl != null && !checkoutUrl.isBlank();
    }

    // Nhận webhook SePay, chống xử lý trùng và cập nhật thanh toán trong cùng giao dịch DB.
    @Transactional(rollbackFor = Exception.class)
    public void processSePayWebhook(Map<String, Object> payload) {
        if (payload == null) {
            throw new IllegalArgumentException("Webhook payload is required.");
        }

        // 1. Kiểm tra chiều tiền vào (transferType = in)
        String transferType = text(payload.get("transferType"));
        if (!transferType.isBlank() && !"in".equalsIgnoreCase(transferType)) {
            throw new IllegalArgumentException("Webhook không phải giao dịch tiền vào.");
        }

        String accountNumber = text(payload.get("accountNumber"));
        if (!CARSTORE_ACCOUNT_NUMBER.equals(accountNumber)) {
            throw new IllegalArgumentException("Tài khoản nhận tiền không khớp tài khoản CarStore.");
        }

        // 2. Lấy nội dung chuyển khoản (content hoặc description) để bóc tách mã đơn hàng
        String content = firstNonBlank(
                text(payload.get("content")),
                text(payload.get("description")),
                text(payload.get("transactionContent")));

        Integer orderId = extractOrderIdFromContent(content);
        if (orderId == null) {
            throw new IllegalArgumentException("Không tìm thấy mã đơn hàng trong nội dung: " + content);
        }

        // 3. Lấy mã giao dịch (transactionNo hoặc id)
        String transactionNo = firstNonBlank(
                text(payload.get("reference_number")),
                text(payload.get("referenceNumber")),
                text(payload.get("referenceCode")),
                text(payload.get("id")));
        if (transactionNo.isBlank() || "null".equalsIgnoreCase(transactionNo)) {
            throw new IllegalArgumentException("Webhook không có mã giao dịch hợp lệ.");
        }
        if (repo.existsByReferenceNumber(transactionNo)) {
            return; 
        }

        // 4. Kiểm tra trạng thái đơn hàng trong Database
        Orders order = orderRepo.findForUpdateById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng ID: " + orderId));

        if (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())) {
            return;
        }
        if (OrderStatus.DELIVERED.equals(order.getStatus())) {
            throw new IllegalArgumentException("Không thể thanh toán đơn hàng đã kết thúc.");
        }

        // Làm tròn đến đơn vị đồng để sai số số thực không từ chối giao dịch hợp lệ.
        double amount = parseAmount(payload.get("transferAmount"));
        double requiredAmount = paymentAmount(order);
        if (Math.round(amount) != Math.round(requiredAmount)) {
            throw new IllegalArgumentException(
                    "Số tiền thanh toán (" + amount + ") không khớp số tiền cần thanh toán (" + requiredAmount + ").");
        }

        // 6. Lấy thời gian giao dịch
        Date paidAt = transactionDate(firstNonBlank(
                text(payload.get("transactionDate")),
                text(payload.get("transaction_date"))));

        if (!wasPaidWithinTimeout(order, paidAt)) {
            throw new IllegalArgumentException("Đơn hàng đã hết hạn trước thời điểm thanh toán.");
        }

        // Webhook có thể đến sau khi scheduler đã hủy đơn dù khách thực tế chuyển
        // tiền trong hạn. Chỉ khôi phục trường hợp này và phải tái giữ kho atomically.
        if (OrderStatus.CANCELLED.equals(order.getStatus())) {
            reserveStockForDelayedPayment(orderId);
            order.setStatus(OrderStatus.PROCESSING);
        }

        // Ghi nhận đã cọc và chuyển đơn sang xử lý ngay sau khi tiền hợp lệ.
        order.setDepositStatus(OrderStatus.DEPOSIT_PAID);
        order.setDepositAmount(amount);
        order.setDepositMethod("SePay");
        order.setDepositPaidAt(paidAt);
        if (OrderStatus.PENDING.equals(order.getStatus())
                || OrderStatus.CONFIRMED.equals(order.getStatus())) {
            order.setStatus(OrderStatus.PROCESSING);
        }
        orderRepo.save(order);

        // 8. Cập nhật hợp đồng liên quan (nếu có)
        contractRepo.findByOrderId(orderId)
                .ifPresent(contract -> updateContract(contract, amount, paidAt));

        // 9. Lưu lịch sử giao dịch thanh toán (PaymentTransaction)
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setOrderId(orderId);
        transaction.setGateway(firstNonBlank(
                text(payload.get("gateway")),
                "SePay"));
        transaction.setTransactionNo(transactionNo);
        transaction.setBankCode(accountNumber);
        transaction.setAmount(amount);
        transaction.setStatus("SUCCESS");
        transaction.setResponseCode("00");
        transaction.setPaidAt(paidAt);
        transaction.setRawResponse(rawPayload(payload));
        PaymentTransaction savedTransaction = repo.save(transaction);

        // 10. Gửi email hóa đơn xác nhận cho khách hàng, không làm rollback thanh toán nếu SMTP lỗi
        try {
            accountRepo.findByUsername(order.getUsername())
                    .ifPresent(account -> mailService.sendInvoiceEmail(account, order, savedTransaction,
                            detailRepo.findByOrderId(orderId), content));
        } catch (Exception exception) {
            logger.warn("Không thể gửi email hóa đơn cho đơn hàng {}: {}", orderId, exception.getMessage(), exception);
        }

        // 11. Gửi email thông báo
        try {
            sendPaymentEmails(order, amount);
        } catch (Exception exception) {
            logger.warn("Không thể gửi email thông báo thanh toán cho đơn hàng {}: {}",
                    orderId, exception.getMessage(), exception);
        }
    }

    private Integer extractOrderIdFromContent(String content) {
        if (content == null || content.isBlank())
            return null;
        Matcher matcher = ORDER_CODE_PATTERN.matcher(content);
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private double parseAmount(Object amountObj) {
        if (amountObj == null)
            return 0.0;
        try {
            if (amountObj instanceof Number) {
                return ((Number) amountObj).doubleValue();
            }
            return Double.parseDouble(amountObj.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private boolean wasPaidWithinTimeout(Orders order, Date paidAt) {
        if (order.getCreateDate() == null || paidAt == null) {
            return false;
        }
        long expiresAt = order.getCreateDate().getTime() + PAYMENT_TIMEOUT_MILLIS;
        return paidAt.getTime() <= expiresAt;
    }

    private void reserveStockForDelayedPayment(Integer orderId) {
        List<OrderDetail> details = detailRepo.findByOrderId(orderId);
        if (details.isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng không có sản phẩm để khôi phục thanh toán.");
        }
        for (OrderDetail detail : details) {
            if (detail.getCar() == null || detail.getCar().getId() == null) {
                throw new IllegalArgumentException("Xe trong đơn hàng không còn tồn tại.");
            }
            int quantity = detail.getQuantity() == null ? 0 : detail.getQuantity();
            if (quantity <= 0) {
                throw new IllegalArgumentException("Số lượng xe trong đơn hàng không hợp lệ.");
            }
            Car car = carRepo.findForUpdateById(detail.getCar().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Xe trong đơn hàng không còn tồn tại."));
            if (!"AVAILABLE".equalsIgnoreCase(car.getStatus())
                    || car.getStock() == null || car.getStock() < quantity) {
                throw new IllegalArgumentException(
                        "Giao dịch đã nhận nhưng xe không còn đủ tồn kho; cần đối soát thủ công.");
            }
            car.setStock(car.getStock() - quantity);
            car.setStatus(car.getStock() == 0 ? "DEPOSITED" : "AVAILABLE");
            carRepo.save(car);
        }
    }

    private void updateContract(Contract contract, double amount, Date paidAt) {
        contract.setDepositStatus("PAID");
        contract.setDepositAmount(amount);
        contract.setDepositMethod("SePay");
        contract.setDepositPaidAt(paidAt);
        contractRepo.save(contract);
    }

    private void sendPaymentEmails(Orders order, double amount) {
        for (Account account : accountRepo.findAll()) {
            if (account.getRole() != null
                    && ("ADMIN".equalsIgnoreCase(account.getRole())
                            || "ROLE_ADMIN".equalsIgnoreCase(account.getRole()))
                    && account.getEmail() != null
                    && !account.getEmail().isBlank()) {
                mailService.sendSePayPaymentSuccess(account.getEmail(), order.getId(), amount, true);
            }
        }
    }

    private double orderTotal(Integer orderId) {
        return detailRepo.findByOrderId(orderId).stream()
                .mapToDouble(detail -> detail.getPrice() * detail.getQuantity())
                .sum();
    }

    private double paymentAmount(Orders order) {
        if (order.getDepositAmount() != null && order.getDepositAmount() > 0) {
            return order.getDepositAmount();
        }
        return contractRepo.findByOrderId(order.getId())
                .map(contract -> contract.getDepositAmount() != null
                        ? contract.getDepositAmount()
                        : contract.getDeposit())
                .orElseGet(() -> orderTotal(order.getId()));
    }

    @SuppressWarnings("unused")
    private String sign(Map<String, String> fields) {
        StringBuilder value = new StringBuilder();
        for (Map.Entry<String, String> field : fields.entrySet()) {
            if (value.length() > 0)
                value.append(',');
            value.append(field.getKey()).append('=').append(field.getValue());
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getEncoder().encodeToString(
                    mac.doFinal(value.toString().getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Không thể tạo chữ ký SePay.", exception);
        }
    }

    private Date transactionDate(String value) {
        if (value == null || value.isBlank())
            return new Date();
        try {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(value);
        } catch (ParseException exception) {
            return new Date();
        }
    }

    private String rawPayload(Map<String, Object> payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException exception) {
            return payload.toString();
        }
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank())
                return value;
        }
        return "";
    }

    private String text(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }
}
