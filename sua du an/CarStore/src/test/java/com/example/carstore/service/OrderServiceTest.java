package com.example.carstore.service;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.CartItem;
import com.example.carstore.entity.OrderDetail;
import com.example.carstore.entity.Orders;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.util.OrderStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepo;
    @Mock private OrderDetailRepository detailRepo;
    @Mock private CarService carService;
    @Mock private CarRepository carRepo;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepo, detailRepo, carService, carRepo);
    }

    @Test
    void checkoutUsesDatabasePriceAndDecreasesStock() {
        Car car = car(1, 1_200_000_000D, 3);
        CartItem item = new CartItem(1, "Tên từ client", 1D, 1);
        Orders savedOrder = new Orders();
        savedOrder.setId(10);

        when(orderRepo.save(any(Orders.class))).thenReturn(savedOrder);
        when(carRepo.findForUpdateById(1)).thenReturn(Optional.of(car));

        Orders result = orderService.checkout("user1", "Quận 7", Map.of(1, item));

        assertEquals(10, result.getId());
        assertEquals(2, car.getStock());
        ArgumentCaptor<OrderDetail> detailCaptor = ArgumentCaptor.forClass(OrderDetail.class);
        verify(detailRepo).save(detailCaptor.capture());
        assertEquals(1_200_000_000D, detailCaptor.getValue().getPrice());
        assertEquals(1, detailCaptor.getValue().getQuantity());
    }

    @Test
    void checkoutRejectsQuantityGreaterThanStock() {
        Car car = car(1, 500_000_000D, 1);
        CartItem item = new CartItem(1, "Xe", 1D, 2);
        Orders savedOrder = new Orders();
        savedOrder.setId(11);

        when(orderRepo.save(any(Orders.class))).thenReturn(savedOrder);
        when(carRepo.findForUpdateById(1)).thenReturn(Optional.of(car));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> orderService.checkout("user1", "Hà Nội", Map.of(1, item)));

        assertTrue(error.getMessage().contains("không đủ tồn kho"));
        verify(detailRepo, never()).save(any());
    }

    @Test
    void payDepositCalculatesTenPercentAndChangesStatus() {
        Orders order = confirmedOrder();
        OrderDetail detail = new OrderDetail();
        detail.setPrice(1_000_000_000D);
        detail.setQuantity(1);

        when(orderRepo.findForUpdateById(20)).thenReturn(Optional.of(order));
        when(detailRepo.findByOrderId(20)).thenReturn(List.of(detail));
        when(orderRepo.save(order)).thenReturn(order);

        Orders result = orderService.payDeposit(20, "user1", "BANK_TRANSFER", false);

        assertEquals(100_000_000D, result.getDepositAmount());
        assertEquals(OrderStatus.DEPOSIT_PAID, result.getDepositStatus());
        assertEquals(OrderStatus.PROCESSING, result.getStatus());
        assertNotNull(result.getDepositPaidAt());
    }

    @Test
    void payDepositRejectsRepeatedPayment() {
        Orders order = confirmedOrder();
        order.setDepositStatus(OrderStatus.DEPOSIT_PAID);
        when(orderRepo.findForUpdateById(20)).thenReturn(Optional.of(order));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> orderService.payDeposit(20, "user1", "BANK_TRANSFER", false));

        assertTrue(error.getMessage().contains("đã thanh toán"));
        verify(orderRepo, never()).save(any());
    }

    @Test
    void cancelOrderRestoresStockExactlyOnce() {
        Orders order = confirmedOrder();
        Car car = car(1, 500_000_000D, 2);
        OrderDetail detail = new OrderDetail();
        detail.setCar(car);
        detail.setQuantity(1);

        when(orderRepo.findForUpdateById(20)).thenReturn(Optional.of(order));
        when(detailRepo.findByOrderId(20)).thenReturn(List.of(detail));
        when(carRepo.findForUpdateById(1)).thenReturn(Optional.of(car));
        when(orderRepo.save(order)).thenReturn(order);

        Orders result = orderService.updateStatus(20, OrderStatus.CANCELLED);

        assertEquals(OrderStatus.CANCELLED, result.getStatus());
        assertEquals(3, car.getStock());
        verify(carRepo).save(car);
    }

    @Test
    void cancelOrderRejectsPaidDeposit() {
        Orders order = confirmedOrder();
        order.setDepositStatus(OrderStatus.DEPOSIT_PAID);
        when(orderRepo.findForUpdateById(20)).thenReturn(Optional.of(order));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> orderService.updateStatus(20, OrderStatus.CANCELLED));

        assertTrue(error.getMessage().contains("đã thanh toán cọc"));
        verify(detailRepo, never()).findByOrderId(anyInt());
        verify(orderRepo, never()).save(any());
    }

    private Car car(int id, double price, int stock) {
        return new Car(id, "Xe thử nghiệm", price, "test.jpg", "Mô tả", 1, 2025, "Đen", stock);
    }

    private Orders confirmedOrder() {
        Orders order = new Orders();
        order.setId(20);
        order.setUsername("user1");
        order.setStatus(OrderStatus.CONFIRMED);
        order.setDepositStatus(OrderStatus.DEPOSIT_UNPAID);
        return order;
    }
}
