package com.example.carstore.controller;

import com.example.carstore.entity.Orders;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.service.PaymentTransactionService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({ "/api/payment-transactions", "/api/payment" })
public class RestPaymentTransactionController {
    private final PaymentTransactionService service;
    private final OrderRepository orders;

    public RestPaymentTransactionController(PaymentTransactionService service, OrderRepository orders) {
        this.service = service;
        this.orders = orders;
    }

    @GetMapping("/orders/{orderId}")
    public Map<String, Object> byOrder(@PathVariable Integer orderId, Authentication auth) {
        if (auth == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập.");
        }
        Orders order = orders.findById(orderId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        boolean admin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!admin && !order.getUsername().equals(auth.getName())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Bạn không có quyền xem giao dịch.");
        }
        return Map.of("success", true, "data", service.byOrder(orderId));
    }

    @PostMapping("/create-qr")
    public Map<String, Object> createQr(@RequestBody Map<String, Object> payload, Authentication auth) {
        if (auth == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập.");
        }
        Integer orderId;
        try {
            orderId = Integer.valueOf(String.valueOf(payload.get("orderId")));
        } catch (Exception exception) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "orderId không hợp lệ.");
        }
        Orders order = orders.findById(orderId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        boolean admin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!admin && !order.getUsername().equals(auth.getName())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Bạn không có quyền thanh toán đơn hàng này.");
        }
        return Map.of("success", true, "data", service.createQr(order));
    }

    @PostMapping({ "/sepay/webhook", "/webhook" })
    public ResponseEntity<?> sePayWebhook(@RequestBody(required = false) Map<String, Object> payload) {
        try {
            // Nếu SePay chỉ gửi request kiểm tra mà không có body
            if (payload == null) {
                return ResponseEntity.ok(Map.of("success", true));
            }

            service.processSePayWebhook(payload);

            return ResponseEntity.ok(Map.of("success", true));

        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(RestPaymentTransactionController.class)
                    .error("Lỗi xử lý SePay Webhook: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "error", e.getMessage() != null ? e.getMessage() : "Internal error"));
        }
    }

}
