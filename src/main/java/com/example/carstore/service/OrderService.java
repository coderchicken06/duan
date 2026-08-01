package com.example.carstore.service;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.CartItem;
import com.example.carstore.entity.OrderDetail;
import com.example.carstore.entity.Orders;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.util.OrderStatus;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private static final long UNPAID_ORDER_TIMEOUT_MILLIS = 3 * 60 * 1000L;
    private static final List<String> EXPIRABLE_UNPAID_STATUSES =
            List.of(OrderStatus.PENDING, OrderStatus.CONFIRMED);

    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final CarRepository carRepo;
    private final ContractService contractService;
    @SuppressWarnings("unused")
    private final PaymentTransactionService paymentTransactionService;
    private final PromotionService promotionService;

    @Autowired
    public OrderService(OrderRepository orderRepo,
            OrderDetailRepository detailRepo,
            CarService carService,
            CarRepository carRepo,
            ContractService contractService,
            PaymentTransactionService paymentTransactionService,
            PromotionService promotionService) {
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.carRepo = carRepo;
        this.contractService = contractService;
        this.paymentTransactionService = paymentTransactionService;
        this.promotionService = promotionService;
    }

    public OrderService(OrderRepository orderRepo,
            OrderDetailRepository detailRepo,
            CarService carService,
            CarRepository carRepo,
            ContractService contractService) {
        this(orderRepo, detailRepo, carService, carRepo, contractService, null, null);
    }

    public OrderService(OrderRepository orderRepo,
            OrderDetailRepository detailRepo,
            CarService carService,
            CarRepository carRepo) {
        this(orderRepo, detailRepo, carService, carRepo, null, null, null);
    }

    @Transactional
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
            java.util.Optional<Car> carOpt = carRepo.findForUpdateById(item.getId());
            if (carOpt.isEmpty()) {
                throw new IllegalArgumentException("Car not found: " + item.getId());
            }
            Car car = carOpt.get();
            if (item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Invalid quantity for car: " + item.getId());
            }
            if (!"AVAILABLE".equalsIgnoreCase(car.getStatus())) {
                throw new IllegalArgumentException("Xe " + car.getName() + " hiện không khả dụng để đặt cọc.");
            }

            if (car.getStock() <= 0) {
                throw new RuntimeException("Xe " + car.getName() + " đã hết hàng.");
            }
            if (car.getStock() < item.getQuantity()) {
                throw new RuntimeException(
                        "Xe " + car.getName() + " không đủ tồn kho. Còn lại: " + car.getStock()
                                + ", yêu cầu: " + item.getQuantity());
            }

            car.setStock(car.getStock() - item.getQuantity());
            car.setStatus(car.getStock() == 0 ? "DEPOSITED" : "AVAILABLE");
            carRepo.save(car);

            OrderDetail detail = new OrderDetail();
            detail.setOrderId(savedOrder.getId());
            detail.setCar(car);

            // Không tin giá do client gửi lên; giá đơn hàng phải lấy từ database.
            detail.setPrice(promotionService == null ? car.getPrice()
                    : promotionService.priceAfterPromotion(car.getId(), car.getPrice()));
            detail.setQuantity(item.getQuantity());
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
    @Transactional
    public Orders checkout(String username, String address, Map<Integer, CartItem> cart) {
        return checkout(username, address, address, "SePay", cart);
    }

    @Transactional
    public Orders updateStatus(Integer orderId, String targetStatus) {
        if (!OrderStatus.VALID_STATUSES.contains(targetStatus)) {
            throw new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ.");
        }
        Orders order = orderRepo.findForUpdateById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        String current = order.getStatus();
        if (targetStatus.equals(current)) return order;
        if (OrderStatus.CANCELLED.equals(current) || OrderStatus.DELIVERED.equals(current)) {
            throw new IllegalArgumentException("Không thể thay đổi đơn đã kết thúc.");
        }
        if (OrderStatus.CANCELLED.equals(targetStatus)) {
            if (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())) {
                throw new IllegalArgumentException("Không thể hủy đơn đã thanh toán cọc.");
            }
            restoreStock(detailRepo.findByOrderId(orderId));
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
        }
    }

    private void restoreStock(List<OrderDetail> details) {
        for (OrderDetail detail : details) {
            if (detail.getCar() == null) continue;
            Car car = carRepo.findForUpdateById(detail.getCar().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Xe trong đơn hàng không còn tồn tại."));
            int quantity = detail.getQuantity() == null ? 0 : detail.getQuantity();
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
}
