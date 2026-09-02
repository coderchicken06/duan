package com.example.carstore.service;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.CartItem;
import com.example.carstore.entity.OrderDetail;
import com.example.carstore.entity.Orders;
import com.example.carstore.dto.OrderResponseDto;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.util.ImagePathUtils;
import com.example.carstore.util.OrderStatus;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@Service
public class OrderService {

    private static final long UNPAID_ORDER_TIMEOUT_MILLIS = 3 * 60 * 1000L;
    private static final List<String> EXPIRABLE_UNPAID_STATUSES =
            List.of(OrderStatus.PENDING, OrderStatus.CONFIRMED);

    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final CarRepository carRepo;
    private final ContractService contractService;
    private final PromotionService promotionService;

    @Autowired
    public OrderService(OrderRepository orderRepo,
            OrderDetailRepository detailRepo,
            CarRepository carRepo,
            ContractService contractService,
            PromotionService promotionService) {
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.carRepo = carRepo;
        this.contractService = contractService;
        this.promotionService = promotionService;
    }

    public OrderService(OrderRepository orderRepo,
            OrderDetailRepository detailRepo,
            CarRepository carRepo) {
        this(orderRepo, detailRepo, carRepo, null, null);
    }

    @Transactional(rollbackFor = Exception.class)
    public Orders checkout(String username, String address, String registrationAddress, String paymentMethod, Map<Integer, CartItem> cart) {
        if (!StringUtils.hasText(username)) {
            throw new IllegalArgumentException("User is required");
        }
        if (!StringUtils.hasText(address)) {
            throw new IllegalArgumentException("Address is required");
        }
        if (cart == null || cart.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }
        if (cart.size() != 1) {
            throw new IllegalArgumentException("Mỗi phiếu đặt cọc chỉ áp dụng cho một xe.");
        }

        Orders order = new Orders();
        order.setUsername(username);
        // 1. Sửa lỗi setter createDate
        order.setCreateDate(new Date());
        order.setAddress(address.trim());

        // 2. Bổ sung địa chỉ đăng ký & phương thức thanh toán
        order.setRegistrationAddress(StringUtils.hasText(registrationAddress) ? registrationAddress.trim() : address.trim());
        String normalizedPaymentMethod = StringUtils.hasText(paymentMethod) ? paymentMethod.trim() : "SePay";
        if (!"SePay".equalsIgnoreCase(normalizedPaymentMethod)) {
            throw new IllegalArgumentException("Phương thức thanh toán chỉ hỗ trợ QR SePay.");
        }
        order.setPaymentMethod("SePay");

        order.setStatus(OrderStatus.PENDING);
        order.setDepositStatus(OrderStatus.DEPOSIT_UNPAID);
        Orders savedOrder = orderRepo.save(order);

        for (CartItem item : cart.values()) {
            if (item == null || item.getQuantity() != 1) {
                throw new IllegalArgumentException("Mỗi giao dịch đặt cọc chỉ áp dụng cho 01 xe duy nhất");
            }
            item.setQuantity(1);
            java.util.Optional<Car> carOpt = carRepo.findForUpdateById(item.getId());
            if (carOpt.isEmpty()) {
                throw new IllegalArgumentException("Car not found: " + item.getId());
            }
            Car car = carOpt.get();
            if (!"AVAILABLE".equalsIgnoreCase(car.getStatus())) {
                throw new IllegalArgumentException("Xe " + car.getName() + " hiện không khả dụng để đặt cọc.");
            }

            if (car.getStock() <= 0) {
                throw new RuntimeException("Xe " + car.getName() + " đã hết hàng.");
            }
            // Mỗi phiếu cọc chỉ giữ chỗ một xe; xe đã được khóa ghi trong transaction.
            car.setStock(car.getStock() - 1);
            car.setStatus(car.getStock() == 0 ? "DEPOSITED" : "AVAILABLE");
            carRepo.save(car);

            OrderDetail detail = new OrderDetail();
            detail.setOrderId(savedOrder.getId());
            detail.setCar(car);

            // Không tin giá do client gửi lên; giá đơn hàng phải lấy từ database.
            detail.setPrice(promotionService == null ? car.getPrice()
                    : promotionService.priceAfterPromotion(car.getId(), car.getPrice()));
            detail.setQuantity(1);
            detailRepo.save(detail);
        }

        if (contractService != null) {
            double total = calculateTotal(savedOrder.getId());
            savedOrder.setDepositAmount(total * 0.10D);
            savedOrder = orderRepo.save(savedOrder);
            contractService.createForOrder(savedOrder, total);
        }
        return savedOrder;
    }

    // Overload hàm checkout cũ để tránh vỡ code ở các Controller hiện tại chưa truyền đủ tham số
    @Transactional(rollbackFor = Exception.class)
    public Orders checkout(String username, String address, Map<Integer, CartItem> cart) {
        return checkout(username, address, address, "SePay", cart);
    }

    @Transactional(rollbackFor = Exception.class)
    public Orders updateStatus(Integer orderId, String targetStatus) {
        if (!OrderStatus.VALID_STATUSES.contains(targetStatus)) {
            throw new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ.");
        }
        Orders order = orderRepo.findForUpdateById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        String current = order.getStatus();
        if (targetStatus.equals(current)) return order;
        if (OrderStatus.PENDING.equals(targetStatus)
                && (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())
                || OrderStatus.PROCESSING.equals(current)
                || OrderStatus.DELIVERED.equals(current)
                || "COMPLETED".equals(current))) {
            throw new IllegalArgumentException(
                    "Không thể chuyển đơn hàng đã thanh toán về trạng thái Chờ xử lý!");
        }
        if (OrderStatus.CANCELLED.equals(current) || OrderStatus.DELIVERED.equals(current)) {
            throw new IllegalArgumentException("Không thể thay đổi đơn đã kết thúc.");
        }
        if (OrderStatus.CANCELLED.equals(targetStatus)) {
            if (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())) {
                throw new IllegalArgumentException("Không thể hủy đơn đã thanh toán cọc.");
            }
            if (!OrderStatus.PENDING.equals(current)) {
                throw new IllegalArgumentException("Chỉ đơn đang chờ thanh toán cọc mới được hủy thủ công.");
            }
            restoreStock(detailRepo.findByOrderId(orderId));
            if (contractService != null) {
                contractService.cancelForOrder(orderId);
            }
        } else if (OrderStatus.CONFIRMED.equals(targetStatus)
                && !OrderStatus.PENDING.equals(current)) {
            throw new IllegalArgumentException("Chỉ đơn đang chờ mới được xác nhận.");
        } else if (OrderStatus.PROCESSING.equals(targetStatus)) {
            if (!OrderStatus.CONFIRMED.equals(current)) {
                throw new IllegalArgumentException("Chỉ đơn đã xác nhận mới được chuyển sang xử lý.");
            }
            if (!OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())) {
                throw new IllegalArgumentException("Đơn thanh toán QR phải được xác nhận tiền cọc trước khi xử lý.");
            }
        } else if (OrderStatus.DELIVERED.equals(targetStatus)
                && !OrderStatus.PROCESSING.equals(current)) {
            throw new IllegalArgumentException("Chỉ đơn đang xử lý mới được đánh dấu đã giao.");
        }
        if (OrderStatus.DELIVERED.equals(targetStatus)) {
            markOutOfStockCarsAsSold(detailRepo.findByOrderId(orderId));
        }
        order.setStatus(targetStatus);
        return orderRepo.save(order);
    }

    @Transactional
    public void cancelExpiredOrders() {
        Date threshold = new Date(System.currentTimeMillis() - UNPAID_ORDER_TIMEOUT_MILLIS);
        List<Orders> expiredOrders = new java.util.ArrayList<>();
        for (String status : EXPIRABLE_UNPAID_STATUSES) {
            expiredOrders.addAll(orderRepo.findByDepositStatusAndStatusAndCreateDateBefore(
                    OrderStatus.DEPOSIT_UNPAID, status, threshold));
        }

        for (Orders order : expiredOrders) {
            Orders lockedOrder = orderRepo.findForUpdateById(order.getId()).orElse(null);
            if (lockedOrder == null
                    || !EXPIRABLE_UNPAID_STATUSES.contains(lockedOrder.getStatus())
                    || !OrderStatus.DEPOSIT_UNPAID.equals(lockedOrder.getDepositStatus())
                    || lockedOrder.getCreateDate() == null
                    || !lockedOrder.getCreateDate().before(threshold)) {
                continue;
            }
            lockedOrder.setStatus(OrderStatus.CANCELLED);
            lockedOrder.setDepositStatus(OrderStatus.DEPOSIT_UNPAID);
            orderRepo.save(lockedOrder);
            restoreStock(detailRepo.findByOrderId(lockedOrder.getId()));
            if (contractService != null) {
                contractService.cancelForOrder(lockedOrder.getId());
            }
        }
    }

    private void restoreStock(List<OrderDetail> details) {
        for (OrderDetail detail : details) {
            if (detail.getCar() == null) continue;
            Car car = carRepo.findForUpdateById(detail.getCar().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Xe trong đơn hàng không còn tồn tại."));
            int quantity = detail.getQuantity() == null ? 0 : detail.getQuantity();
            // Khi đơn chưa cọc bị hủy, hoàn lại đúng số lượng và mở bán xe trở lại.
            car.setStock(car.getStock() + quantity);
            if (car.getStock() > 0) {
                car.setStatus("AVAILABLE");
            }
            carRepo.save(car);
        }
    }

    private void markOutOfStockCarsAsSold(List<OrderDetail> details) {
        for (OrderDetail detail : details) {
            if (detail.getCar() == null) continue;
            Car car = carRepo.findForUpdateById(detail.getCar().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Xe trong đơn hàng không còn tồn tại."));
            if (car.getStock() == 0) {
                car.setStatus("SOLD");
                carRepo.save(car);
            }
        }
    }

    @Transactional
    public Orders payDeposit(Integer orderId, String username, String method, boolean admin) {
        throw new IllegalArgumentException(
                "Thanh toán cọc chỉ được xác nhận qua webhook QR SePay.");
    }

    public double calculateTotal(Integer orderId) {
        return detailRepo.findByOrderId(orderId).stream()
                .mapToDouble(d -> d.getPrice() * d.getQuantity())
                .sum();
    }

    public double getRevenue() {
        Double revenue = detailRepo.getRevenue();
        return revenue == null ? 0D : revenue;
    }

    public List<OrderResponseDto> toOrderResponses(List<Orders> orders) {
        List<OrderResponseDto> responses = new ArrayList<>();
        List<Integer> orderIds = orders.stream().map(Orders::getId).toList();
        Map<Integer, Object[]> productsByOrderId = new HashMap<>();

        if (!orderIds.isEmpty()) {
            for (Object[] product : orderRepo.findProductSummariesByOrderIds(orderIds)) {
                Integer orderId = ((Number) product[0]).intValue();
                productsByOrderId.putIfAbsent(orderId, product);
            }
        }

        for (Orders order : orders) {
            OrderResponseDto response = new OrderResponseDto();
            response.setId(order.getId());
            response.setUsername(order.getUsername());
            response.setCreateDate(order.getCreateDate());
            response.setAddress(order.getAddress());
            response.setRegistrationAddress(order.getRegistrationAddress());
            response.setPaymentMethod(order.getPaymentMethod());
            response.setStatus(order.getStatus());
            response.setDepositStatus(order.getDepositStatus());
            response.setDepositAmount(order.getDepositAmount());
            response.setDepositMethod(order.getDepositMethod());
            Date depositPaidAt = resolveDepositPaidAt(order);
            response.setPaidAt(depositPaidAt);
            response.setPaymentTime(depositPaidAt);

            Object[] product = productsByOrderId.get(order.getId());
            if (product != null && product[1] instanceof String carName && StringUtils.hasText(carName)) {
                response.setCarName(carName);
                response.setProductName(carName);
                response.setCarImage(ImagePathUtils.resolve((String) product[2]));
            }
            responses.add(response);
        }
        return responses;
    }

    private Date resolveDepositPaidAt(Orders order) {
        if (order.getDepositPaidAt() != null) {
            return order.getDepositPaidAt();
        }
        String status = order.getStatus();
        if (OrderStatus.PROCESSING.equals(status) || OrderStatus.DELIVERED.equals(status)) {
            return order.getCreateDate();
        }
        return null;
    }
}
