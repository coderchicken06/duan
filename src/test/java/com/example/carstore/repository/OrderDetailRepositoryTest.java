package com.example.carstore.repository;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.OrderDetail;
import com.example.carstore.entity.Orders;
import com.example.carstore.util.OrderStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("h2")
class OrderDetailRepositoryTest {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderDetailRepository detailRepository;
    @Autowired private CarRepository carRepository;

    @Test
    void statisticsIncludeOnlyPaidNonPendingNonCancelledOrders() {
        Car eligibleCar = saveCar("Xe hợp lệ");
        Car excludedCar = saveCar("Xe bị loại");

        saveOrderWithDetail(OrderStatus.CANCELLED, OrderStatus.DEPOSIT_PAID, 100D, excludedCar, 10);
        saveOrderWithDetail(OrderStatus.PENDING, OrderStatus.DEPOSIT_PAID, 200D, excludedCar, 20);
        saveOrderWithDetail(OrderStatus.CONFIRMED, OrderStatus.DEPOSIT_PAID, 300D, eligibleCar, 1);
        saveOrderWithDetail(OrderStatus.PROCESSING, OrderStatus.DEPOSIT_PAID, 400D, eligibleCar, 2);
        saveOrderWithDetail(OrderStatus.DELIVERED, OrderStatus.DEPOSIT_PAID, 500D, eligibleCar, 3);
        saveOrderWithDetail(OrderStatus.PROCESSING, OrderStatus.DEPOSIT_UNPAID, 600D, excludedCar, 30);
        detailRepository.flush();

        assertEquals(1_200D, detailRepository.getRevenue());

        List<Object[]> topCars = detailRepository.topCars();
        assertEquals(1, topCars.size());
        assertEquals("Xe hợp lệ", topCars.get(0)[0]);
        assertEquals(6L, ((Number) topCars.get(0)[1]).longValue());
    }

    private Car saveCar(String name) {
        Car car = new Car(null, name, 1_000_000D, "test.jpg", "Test", 1, 2026, "Đen", 10);
        return carRepository.saveAndFlush(car);
    }

    private void saveOrderWithDetail(
            String status,
            String depositStatus,
            double depositAmount,
            Car car,
            int quantity) {
        Orders order = new Orders();
        order.setUsername("qa-user");
        order.setAddress("Test");
        order.setRegistrationAddress("Test");
        order.setPaymentMethod("SePay");
        order.setStatus(status);
        order.setDepositStatus(depositStatus);
        order.setDepositAmount(depositAmount);
        Orders savedOrder = orderRepository.saveAndFlush(order);
        assertNotNull(savedOrder.getId());

        OrderDetail detail = new OrderDetail();
        detail.setOrderId(savedOrder.getId());
        detail.setCar(car);
        detail.setPrice(car.getPrice());
        detail.setQuantity(quantity);
        detailRepository.save(detail);
    }
}
