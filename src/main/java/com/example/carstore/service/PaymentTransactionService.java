package com.example.carstore.service;

import com.example.carstore.entity.Account;
import com.example.carstore.entity.Contract;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.PaymentTransaction;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.ContractRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.PaymentTransactionRepository;
import com.example.carstore.util.OrderStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private static final Pattern ORDER_CODE_PATTERN = Pattern.compile("(?i)\\bVELOR?(\\d+)\\b");

    private final PaymentTransactionRepository repo;
    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final ContractRepository contractRepo;
    private final AccountRepository accountRepo;
    private final MailService mailService;
    private final ObjectMapper objectMapper;

    @Value("${sepay.merchant-id:}")
    private String merchantId;

    @Value("${sepay.secret-key:}")
    private String secretKey;

    @Value("${sepay.api-key:}")
    private String apiKey;

    @Value("${sepay.secret-key:${SEPAY_SECRET_KEY:}}")
    private String sepaySecretKey;

    @Value("${sepay.checkout-url:https://pay-sandbox.sepay.vn/v1/checkout/init}")
    private String checkoutUrl;

    public PaymentTransactionService(PaymentTransactionRepository repo,
            OrderRepository orderRepo,
            OrderDetailRepository detailRepo,
            ContractRepository contractRepo,
            AccountRepository accountRepo,
            MailService mailService,
            ObjectMapper objectMapper) {
        this.repo = repo;
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
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
        // Đã bỏ requireSePayConfig() vì chúng ta không dùng trang trung gian của SePay
        // nữa

        if (OrderStatus.CANCELLED.equals(order.getStatus())
                || OrderStatus.DELIVERED.equals(order.getStatus())) {
            throw new IllegalArgumentException("Không thể thanh toán đơn hàng đã kết thúc.");
        }
        if (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())) {
            throw new IllegalArgumentException("Đơn hàng đã được thanh toán.");
        }

        double amount = paymentAmount(order.getId());
        if (amount <= 0) {
            throw new IllegalArgumentException("Đơn hàng không có giá trị hợp lệ.");
        }

        try {
            long finalAmount = Math.round(amount);

            // QUAN TRỌNG: Bắt buộc nối thêm "VELOR" + order.getId() vào nội dung chuyển
            // khoản
            // Nếu không có phần này, Webhook SePay sẽ không biết tiền của đơn hàng nào.
            String des = "SEVQR VELOR" + order.getId();

            // Sử dụng mã VietQR chuẩn với số tiền (amount) và nội dung (des) tự động
            String qrUrl = "https://vietqr.app/img?"
                    + "bank=" + java.net.URLEncoder.encode("VietinBank", StandardCharsets.UTF_8)
                    + "&acc=" + java.net.URLEncoder.encode("102880629915", StandardCharsets.UTF_8)
                    + "&amount=" + finalAmount
                    + "&des=" + java.net.URLEncoder.encode(des, StandardCharsets.UTF_8)
                    + "&template=" + java.net.URLEncoder.encode("compact", StandardCharsets.UTF_8);

            Map<String, Object> result = new LinkedHashMap<>();
            // Trả về trực tiếp đường link ảnh QR thay vì trả về Form Submit như cũ
            result.put("qrUrl", qrUrl);
            result.put("orderCode", "VELOR" + order.getId());
            result.put("amount", finalAmount);

            return result;

        } catch (Exception exception) {
            throw new IllegalStateException("Không thể tạo mã VietQR.", exception);
        }
    }

    public boolean isValidWebhookSecret(String secret, String authorization) {

        System.out.println("===== VERIFY =====");
        System.out.println("Config Secret : " + secretKey);
        System.out.println("Header Secret : " + secret);
        System.out.println("Authorization : " + authorization);

        // SePay gửi Authorization: Apikey xxxx
        if (authorization != null) {
            String expected = "Apikey " + secretKey;

            System.out.println("Expected      : " + expected);

            return expected.equalsIgnoreCase(authorization.trim());
        }

        // Một số trường hợp gửi X-Secret-Key
        if (secret != null) {
            return secretKey.equals(secret.trim());
        }

        return false;
    }

    public boolean isSePayConfigured() {
        return merchantId != null && !merchantId.isBlank()
                && secretKey != null && !secretKey.isBlank()
                && checkoutUrl != null && !checkoutUrl.isBlank();
    }

    @Transactional
    public void processSePayWebhook(Map<String, Object> payload) {
        if (payload == null) {
            throw new IllegalArgumentException("Webhook payload is required.");
        }

        String notificationType = text(payload.get("notification_type"));
        if (!notificationType.isBlank() && !"ORDER_PAID".equalsIgnoreCase(notificationType)) {
            throw new IllegalArgumentException("Webhook không phải thông báo thanh toán thành công.");
        }
        String transferType = text(payload.get("transferType"));
        if (!transferType.isBlank() && !"in".equalsIgnoreCase(transferType)) {
            throw new IllegalArgumentException("Webhook không phải giao dịch tiền vào.");
        }

        Map<String, Object> orderData = map(payload.get("order"));
        Map<String, Object> transactionData = map(payload.get("transaction"));
        Integer orderId = extractOrderId(payload, orderData);
        String transactionNo = transactionNo(payload, transactionData);
        if (repo.existsByTransactionNo(transactionNo)) {
            return;
        }

        Orders order = orderRepo.findForUpdateById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        if (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())) {
            return;
        }
        if (OrderStatus.CANCELLED.equals(order.getStatus())
                || OrderStatus.DELIVERED.equals(order.getStatus())) {
            throw new IllegalArgumentException("Không thể thanh toán đơn hàng đã kết thúc.");
        }

        double amount = webhookAmount(payload, transactionData, orderData);
        double requiredAmount = paymentAmount(orderId);
        if (Double.compare(amount, requiredAmount) != 0) {
            throw new IllegalArgumentException("Số tiền thanh toán không khớp số tiền cần thanh toán.");
        }

        Date paidAt = transactionDate(firstNonBlank(
                text(transactionData.get("transaction_date")),
                text(payload.get("transactionDate"))));
        order.setDepositStatus(OrderStatus.DEPOSIT_PAID);
        order.setDepositAmount(amount);
        order.setDepositMethod("SePay");
        order.setDepositPaidAt(paidAt);
        orderRepo.save(order);

        contractRepo.findByOrderId(orderId)
                .ifPresent(contract -> updateContract(contract, amount, paidAt));

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setOrderId(orderId);
        transaction.setGateway(firstNonBlank(
                text(transactionData.get("payment_method")),
                text(payload.get("gateway")),
                "SePay"));
        transaction.setTransactionNo(transactionNo);
        transaction.setBankCode(text(payload.get("accountNumber")));
        transaction.setAmount(amount);
        transaction.setStatus("SUCCESS");
        transaction.setResponseCode("00");
        transaction.setPaidAt(paidAt);
        transaction.setRawResponse(rawPayload(payload));
        repo.save(transaction);

        try {
            sendPaymentEmails(order, amount);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Integer extractOrderId(Map<String, Object> payload, Map<String, Object> orderData) {
        String searchable = String.join(" ",
                text(orderData.get("order_invoice_number")),
                text(orderData.get("order_description")),
                text(payload.get("description")),
                text(payload.get("content")),
                text(payload.get("transactionContent")));
        System.out.println("Search = " + searchable);
        Matcher matcher = ORDER_CODE_PATTERN.matcher(searchable);
        if (!matcher.find()) {
            throw new IllegalArgumentException("Không tìm thấy mã đơn VELOR trong webhook.");
        }
        return Integer.valueOf(matcher.group(1));
    }

    private String transactionNo(Map<String, Object> payload, Map<String, Object> transactionData) {
        String value = firstNonBlank(
                text(transactionData.get("transaction_id")),
                text(transactionData.get("id")),
                text(payload.get("id")),
                text(payload.get("referenceCode")));
        if (value.isBlank()) {
            throw new IllegalArgumentException("Webhook thiếu transaction ID của SePay.");
        }
        return "SEPAY-" + value;
    }

    private double webhookAmount(Map<String, Object> payload,
            Map<String, Object> transactionData,
            Map<String, Object> orderData) {
        String value = firstNonBlank(
                text(transactionData.get("transaction_amount")),
                text(payload.get("transferAmount")),
                text(orderData.get("order_amount")));
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("Số tiền giao dịch không hợp lệ.");
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
        accountRepo.findByUsername(order.getUsername()).ifPresent(account -> {
            if (account.getEmail() != null && !account.getEmail().isBlank()) {
                mailService.sendSePayPaymentSuccess(account.getEmail(), order.getId(), amount, false);
            }
        });
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

    private double paymentAmount(Integer orderId) {
        return contractRepo.findByOrderId(orderId)
                .map(contract -> contract.getDepositAmount() != null
                        ? contract.getDepositAmount()
                        : contract.getDeposit())
                .orElseGet(() -> orderTotal(orderId));
    }

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

    private void requireSePayConfig() {
        if (!isSePayConfigured()) {
            throw new IllegalArgumentException("SePay chưa được cấu hình.");
        }
    }

    private Date transactionDate(String value) {
        if (value.isBlank())
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

    @SuppressWarnings("unchecked")
    private Map<String, Object> map(Object value) {
        return value instanceof Map ? (Map<String, Object>) value : Map.of();
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
