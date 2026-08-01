package com.example.carstore.config;

import com.example.carstore.service.OrderService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrderScheduler {

    private final OrderService orderService;

    public OrderScheduler(OrderService orderService) {
        this.orderService = orderService;
    }

    @Scheduled(fixedRate = 60_000)
    public void cancelExpiredOrders() {
        orderService.cancelExpiredOrders();
    }
}
