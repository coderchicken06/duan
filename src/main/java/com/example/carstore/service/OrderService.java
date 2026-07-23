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

    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final CarRepository carRepo;
    private final ContractService contractService;
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
        order.setPaymentMethod(StringUtils.hasText(paymentMethod) ? paymentMethod.trim() : "Chuyển khoản QR");

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

            if (car.getStock() == null || car.getStock() < item.getQuantity()) {
                throw new IllegalArgumentException(
                        "Xe " + car.getName() + " không đủ tồn kho. Còn lại: " + car.getStock());
            }

            car.setStock(car.getStock() - item.getQuantity());
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
            contractService.createForOrder(savedOrder, calculateTotal(savedOrder.getId()));
        }
        return savedOrder;
    }

    // Overload hàm checkout cũ để tránh vỡ code ở các Controller hiện tại chưa truyền đủ tham số
    @Transactional
    public Orders checkout(String username, String address, Map<Integer, CartItem> cart) {
        return checkout(username, address, address, "Chuyển khoản QR", cart);
    }

    @Transactional
    public void deleteOrder(Integer orderId) {
        Orders order = orderRepo.findForUpdateById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        if (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())
                || OrderStatus.PROCESSING.equals(order.getStatus())
                || OrderStatus.DELIVERED.equals(order.getStatus())) {
            throw new IllegalArgumentException("Không thể xóa đơn đã cọc, đang xử lý hoặc đã giao.");
        }

        List<OrderDetail> details = detailRepo.findByOrderId(orderId);
        if (!OrderStatus.CANCELLED.equals(order.getStatus())) {
            restoreStock(details);
        }
        for (OrderDetail detail : details) {
            detailRepo.deleteById(detail.getId());
        }
        orderRepo.deleteById(orderId);
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
            throw new IllegalArgumentException("Đơn tự chuyển sang xử lý sau khi thanh toán cọc.");
        } else if (OrderStatus.DELIVERED.equals(targetStatus)
                && !OrderStatus.PROCESSING.equals(current)) {
            throw new IllegalArgumentException("Chỉ đơn đang xử lý mới được đánh dấu đã giao.");
        }
        order.setStatus(targetStatus);
        return orderRepo.save(order);
    }

    private void restoreStock(List<OrderDetail> details) {
        for (OrderDetail detail : details) {
            if (detail.getCar() == null) continue;
            Car car = carRepo.findForUpdateById(detail.getCar().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Xe trong đơn hàng không còn tồn tại."));
            int quantity = detail.getQuantity() == null ? 0 : detail.getQuantity();
            car.setStock(car.getStock() + quantity);
            carRepo.save(car);
        }
    }

    @Transactional
    public Orders payDeposit(Integer orderId, String username, String method, boolean admin) {
        Orders order = orderRepo.findForUpdateById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!admin && !order.getUsername().equals(username)) {
            throw new IllegalArgumentException("Bạn không có quyền thanh toán đơn hàng này.");
        }
        if (!OrderStatus.CONFIRMED.equals(order.getStatus())) {
            throw new IllegalArgumentException("Chỉ được thanh toán cọc sau khi đơn hàng đã được duyệt.");
        }
        if (OrderStatus.DEPOSIT_PAID.equals(order.getDepositStatus())) {
            throw new IllegalArgumentException("Đơn hàng này đã thanh toán tiền cọc.");
        }
        if (!StringUtils.hasText(method)) {
            throw new IllegalArgumentException("Vui lòng chọn phương thức thanh toán.");
        }

        List<OrderDetail> details = detailRepo.findByOrderId(orderId);
        double total = details.stream()
                .mapToDouble(d -> d.getPrice() * d.getQuantity())
                .sum();
        if (total <= 0) {
            throw new IllegalArgumentException("Đơn hàng không có giá trị hợp lệ.");
        }

        order.setDepositAmount((double) Math.round(total * 0.10D));
        order.setDepositMethod(method.trim());
        order.setDepositStatus(OrderStatus.DEPOSIT_PAID);
        order.setDepositPaidAt(new Date());
        order.setStatus(OrderStatus.PROCESSING);
        Orders paidOrder = orderRepo.save(order);
        if (contractService != null) {
            contractService.syncDeposit(paidOrder, method.trim());
        }
        if (paymentTransactionService != null) {
            paymentTransactionService.recordSuccessfulDeposit(paidOrder, method.trim());
        }
        return paidOrder;
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
