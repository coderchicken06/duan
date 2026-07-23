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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final CarService carService;
    private final CarRepository carRepo;

    public OrderService(OrderRepository orderRepo,
            OrderDetailRepository detailRepo,
            CarService carService,
            CarRepository carRepo) {
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.carService = carService;
        this.carRepo = carRepo;
    }

    @Transactional
    public Orders checkout(String username, String address, Map<Integer, CartItem> cart) {
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
        order.setCreate_date(new Date());
        order.setAddress(address.trim());
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
            detail.setPrice(car.getPrice());
            detail.setQuantity(item.getQuantity());
            detailRepo.save(detail);
        }

        return savedOrder;
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
        return orderRepo.save(order);
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
