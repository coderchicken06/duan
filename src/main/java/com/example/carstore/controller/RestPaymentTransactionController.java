package com.example.carstore.controller;

import com.example.carstore.entity.Orders;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.service.PaymentTransactionService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

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
        Orders order = orders.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        boolean admin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (auth == null || (!admin && !order.getUsername().equals(auth.getName()))) {
            throw new IllegalArgumentException("Bạn không có quyền xem giao dịch.");
        }
        return Map.of("success", true, "data", service.byOrder(orderId));
    }

    @PostMapping("/create-qr")
    public Map<String, Object> createQr(@RequestBody Map<String, Object> payload, Authentication auth) {
        if (auth == null) {
            throw new IllegalArgumentException("Not authenticated");
        }
        Integer orderId;
        try {
            orderId = Integer.valueOf(String.valueOf(payload.get("orderId")));
        } catch (Exception exception) {
            throw new IllegalArgumentException("orderId không hợp lệ.");
        }
        Orders order = orders.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        boolean admin = auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!admin && !order.getUsername().equals(auth.getName())) {
            throw new IllegalArgumentException("Bạn không có quyền thanh toán đơn hàng này.");
        }
        return Map.of("success", true, "data", service.createQr(order));
    }

    @PostMapping("/sepay/webhook")
    public ResponseEntity<?> sePayWebhook(

            @RequestBody(required = false) Map<String, Object> payload,

            @RequestHeader(value = "Authorization", required = false) String authorization,

            @RequestHeader(value = "X-Secret-Key", required = false) String secret,

            HttpServletRequest request) {

        try {

            System.out.println("===== WEBHOOK =====");

            System.out.println("Method = " + request.getMethod());
            System.out.println("Content-Type = " + request.getContentType());
            Enumeration<String> names = request.getHeaderNames();

            while (names.hasMoreElements()) {
                String h = names.nextElement();
                System.out.println(h + " = " + request.getHeader(h));
            }

            System.out.println("Payload = " + payload);

            System.out.println("Authorization = " + authorization);
            System.out.println("Secret = " + secret);

            // Nếu SePay chỉ gửi request kiểm tra mà không có body
            if (payload == null) {
                System.out.println("Webhook verify (no payload)");
                return ResponseEntity.ok(Map.of(
                        "success", true));
            }

            service.processSePayWebhook(payload);

            return ResponseEntity.ok(Map.of(
                    "success", true));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()));
        }
    }
}
