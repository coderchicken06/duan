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
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepo;
    @Mock private OrderDetailRepository detailRepo;
    @Mock private CarRepository carRepo;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepo, detailRepo, carRepo);
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
        assertEquals("AVAILABLE", car.getStatus());
        ArgumentCaptor<Orders> orderCaptor = ArgumentCaptor.forClass(Orders.class);
        verify(orderRepo).save(orderCaptor.capture());
        assertEquals("SePay", orderCaptor.getValue().getPaymentMethod());
        ArgumentCaptor<OrderDetail> detailCaptor = ArgumentCaptor.forClass(OrderDetail.class);
        verify(detailRepo).save(detailCaptor.capture());
        assertEquals(1_200_000_000D, detailCaptor.getValue().getPrice());
        assertEquals(1, detailCaptor.getValue().getQuantity());
    }

    @Test
    void checkoutConsumesLastUnitAndMarksCarDeposited() {
        Car car = car(1, 500_000_000D, 1);
        CartItem item = new CartItem(1, "Car", 1D, 1);
        Orders savedOrder = new Orders();
        savedOrder.setId(11);

        when(orderRepo.save(any(Orders.class))).thenReturn(savedOrder);
        when(carRepo.findForUpdateById(1)).thenReturn(Optional.of(car));

        orderService.checkout("user1", "Address", Map.of(1, item));

        assertEquals(0, car.getStock());
        assertEquals("DEPOSITED", car.getStatus());
        verify(carRepo).save(car);
    }

    @Test
    void checkoutRejectsUnsupportedPaymentMethod() {
        CartItem item = new CartItem(1, "Xe", 1D, 1);

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> orderService.checkout(
                        "user1", "Hà Nội", "Hà Nội", "UNSUPPORTED", Map.of(1, item)));

        assertTrue(error.getMessage().contains("QR SePay"));
        verifyNoInteractions(orderRepo, detailRepo, carRepo);
    }

    @Test
    void checkoutRejectsQuantityDifferentFromOne() {
        CartItem item = new CartItem(1, "Xe", 1D, 2);

        RuntimeException error = assertThrows(RuntimeException.class,
                () -> orderService.checkout("user1", "Hà Nội", Map.of(1, item)));

        assertTrue(error.getMessage().contains("01 xe duy nhất"));
        verify(detailRepo, never()).save(any());
    }

    @Test
    void checkoutRejectsCarWithZeroStock() {
        Car car = car(1, 500_000_000D, 0);
        CartItem item = new CartItem(1, "Xe", 1D, 1);
        Orders savedOrder = new Orders();
        savedOrder.setId(12);

        when(orderRepo.save(any(Orders.class))).thenReturn(savedOrder);
        when(carRepo.findForUpdateById(1)).thenReturn(Optional.of(car));

        RuntimeException error = assertThrows(RuntimeException.class,
                () -> orderService.checkout("user1", "Hà Nội", Map.of(1, item)));

        assertTrue(error.getMessage().contains("hết hàng"));
        verify(detailRepo, never()).save(any());
        verify(carRepo, never()).save(any());
    }

    @Test
    void checkoutRejectsUnavailableCar() {
        Car car = car(1, 500_000_000D, 2);
        car.setStatus("INACTIVE");
        CartItem item = new CartItem(1, "Xe", 1D, 1);
        Orders savedOrder = new Orders();
        savedOrder.setId(13);

        when(orderRepo.save(any(Orders.class))).thenReturn(savedOrder);
        when(carRepo.findForUpdateById(1)).thenReturn(Optional.of(car));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> orderService.checkout("user1", "Hà Nội", Map.of(1, item)));

        assertTrue(error.getMessage().contains("không khả dụng"));
        verify(detailRepo, never()).save(any());
        verify(carRepo, never()).save(any());
    }

    @Test
    void cancelExpiredOrdersSkipsOrderPaidBeforeLock() {
        Orders staleOrder = new Orders();
        staleOrder.setId(30);
        staleOrder.setStatus(OrderStatus.PENDING);
        staleOrder.setDepositStatus(OrderStatus.DEPOSIT_UNPAID);
        staleOrder.setCreateDate(new Date(System.currentTimeMillis() - 20 * 60 * 1000L));

        Orders paidOrder = new Orders();
        paidOrder.setId(30);
        paidOrder.setStatus(OrderStatus.PENDING);
        paidOrder.setDepositStatus(OrderStatus.DEPOSIT_PAID);
        paidOrder.setCreateDate(staleOrder.getCreateDate());

        when(orderRepo.findByDepositStatusAndStatusAndCreateDateBefore(
                eq(OrderStatus.DEPOSIT_UNPAID), eq(OrderStatus.PENDING), any(Date.class)))
                .thenReturn(List.of(staleOrder));
        when(orderRepo.findForUpdateById(30)).thenReturn(Optional.of(paidOrder));

        orderService.cancelExpiredOrders();

        assertEquals(OrderStatus.PENDING, paidOrder.getStatus());
        verify(orderRepo, never()).save(paidOrder);
        verify(detailRepo, never()).findByOrderId(anyInt());
        verifyNoInteractions(carRepo);
    }

    @Test
    void cancelExpiredOrdersUsesThreeMinuteTimeout() {
        long beforeCall = System.currentTimeMillis();
        when(orderRepo.findByDepositStatusAndStatusAndCreateDateBefore(
                eq(OrderStatus.DEPOSIT_UNPAID), eq(OrderStatus.PENDING), any(Date.class)))
                .thenReturn(List.of());

        orderService.cancelExpiredOrders();

        ArgumentCaptor<Date> thresholdCaptor = ArgumentCaptor.forClass(Date.class);
        verify(orderRepo).findByDepositStatusAndStatusAndCreateDateBefore(
                eq(OrderStatus.DEPOSIT_UNPAID), eq(OrderStatus.PENDING), thresholdCaptor.capture());
        long elapsed = beforeCall - thresholdCaptor.getValue().getTime();
        assertTrue(Math.abs(elapsed - 3 * 60 * 1000L) < 5_000L);
    }

    @Test
    void cancelExpiredOrdersCancelsPendingAndConfirmedOrdersAndRestoresStock() {
        Date expiredAt = new Date(System.currentTimeMillis() - 4 * 60 * 1000L);
        Orders pendingOrder = unpaidOrder(31, OrderStatus.PENDING, expiredAt);
        Orders confirmedOrder = unpaidOrder(32, OrderStatus.CONFIRMED, expiredAt);
        Car pendingCar = car(1, 500_000_000D, 0);
        pendingCar.setStatus("DEPOSITED");
        Car confirmedCar = car(2, 700_000_000D, 0);
        confirmedCar.setStatus("DEPOSITED");
        OrderDetail pendingDetail = orderDetail(pendingCar, 1);
        OrderDetail confirmedDetail = orderDetail(confirmedCar, 2);

        when(orderRepo.findByDepositStatusAndStatusAndCreateDateBefore(
                eq(OrderStatus.DEPOSIT_UNPAID), eq(OrderStatus.PENDING), any(Date.class)))
                .thenReturn(List.of(pendingOrder));
        when(orderRepo.findByDepositStatusAndStatusAndCreateDateBefore(
                eq(OrderStatus.DEPOSIT_UNPAID), eq(OrderStatus.CONFIRMED), any(Date.class)))
                .thenReturn(List.of(confirmedOrder));
        when(orderRepo.findForUpdateById(31)).thenReturn(Optional.of(pendingOrder));
        when(orderRepo.findForUpdateById(32)).thenReturn(Optional.of(confirmedOrder));
        when(detailRepo.findByOrderId(31)).thenReturn(List.of(pendingDetail));
        when(detailRepo.findByOrderId(32)).thenReturn(List.of(confirmedDetail));
        when(carRepo.findForUpdateById(1)).thenReturn(Optional.of(pendingCar));
        when(carRepo.findForUpdateById(2)).thenReturn(Optional.of(confirmedCar));

        orderService.cancelExpiredOrders();

        assertAll(
                () -> assertEquals(OrderStatus.CANCELLED, pendingOrder.getStatus()),
                () -> assertEquals(OrderStatus.CANCELLED, confirmedOrder.getStatus()),
                () -> assertEquals(1, pendingCar.getStock()),
                () -> assertEquals(2, confirmedCar.getStock()),
                () -> assertEquals("AVAILABLE", pendingCar.getStatus()),
                () -> assertEquals("AVAILABLE", confirmedCar.getStatus()));
        verify(orderRepo).save(pendingOrder);
        verify(orderRepo).save(confirmedOrder);
        verify(carRepo).save(pendingCar);
        verify(carRepo).save(confirmedCar);
    }

    @Test
    void manualDepositIsRejected() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> orderService.payDeposit(20, "user1", "SePay", false));

        assertTrue(error.getMessage().contains("webhook QR SePay"));
        verifyNoInteractions(orderRepo, detailRepo, carRepo);
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

    @Test
    void paidSePayOrderCanMoveToProcessing() {
        Orders order = confirmedOrder();
        order.setPaymentMethod("SePay");
        order.setDepositStatus(OrderStatus.DEPOSIT_PAID);
        when(orderRepo.findForUpdateById(20)).thenReturn(Optional.of(order));
        when(orderRepo.save(order)).thenReturn(order);

        Orders result = orderService.updateStatus(20, OrderStatus.PROCESSING);

        assertEquals(OrderStatus.PROCESSING, result.getStatus());
    }

    @Test
    void unpaidQrOrderCannotMoveToProcessing() {
        Orders order = confirmedOrder();
        order.setPaymentMethod("SePay");
        when(orderRepo.findForUpdateById(20)).thenReturn(Optional.of(order));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> orderService.updateStatus(20, OrderStatus.PROCESSING));

        assertTrue(error.getMessage().contains("xác nhận tiền cọc"));
        verify(orderRepo, never()).save(any());
    }

    @Test
    void deliveredOrderMarksOutOfStockCarSold() {
        Orders order = confirmedOrder();
        order.setStatus(OrderStatus.PROCESSING);
        Car car = car(1, 500_000_000D, 0);
        car.setStatus("DEPOSITED");
        OrderDetail detail = orderDetail(car, 1);

        when(orderRepo.findForUpdateById(20)).thenReturn(Optional.of(order));
        when(detailRepo.findByOrderId(20)).thenReturn(List.of(detail));
        when(carRepo.findForUpdateById(1)).thenReturn(Optional.of(car));
        when(orderRepo.save(order)).thenReturn(order);

        Orders result = orderService.updateStatus(20, OrderStatus.DELIVERED);

        assertEquals(OrderStatus.DELIVERED, result.getStatus());
        assertEquals("SOLD", car.getStatus());
        verify(carRepo).save(car);
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

    private Orders unpaidOrder(int id, String status, Date createDate) {
        Orders order = new Orders();
        order.setId(id);
        order.setStatus(status);
        order.setDepositStatus(OrderStatus.DEPOSIT_UNPAID);
        order.setCreateDate(createDate);
        return order;
    }

    private OrderDetail orderDetail(Car car, int quantity) {
        OrderDetail detail = new OrderDetail();
        detail.setCar(car);
        detail.setQuantity(quantity);
        return detail;
    }
}
