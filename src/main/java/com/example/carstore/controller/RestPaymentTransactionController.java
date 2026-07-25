package com.example.carstore.controller;
import com.example.carstore.entity.Orders;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.service.PaymentTransactionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/payment-transactions")
public class RestPaymentTransactionController{
 private final PaymentTransactionService service;private final OrderRepository orders;
 public RestPaymentTransactionController(PaymentTransactionService service,OrderRepository orders){this.service=service;this.orders=orders;}
 @GetMapping("/orders/{orderId}") public Map<String,Object> byOrder(@PathVariable Integer orderId,Authentication auth){
  Orders order=orders.findById(orderId).orElseThrow(()->new IllegalArgumentException("Không tìm thấy đơn hàng."));
  boolean admin=auth!=null&&auth.getAuthorities().stream().anyMatch(a->"ROLE_ADMIN".equals(a.getAuthority()));
  if(auth==null||(!admin&&!order.getUsername().equals(auth.getName())))throw new IllegalArgumentException("Bạn không có quyền xem giao dịch.");
  return Map.of("success",true,"data",service.byOrder(orderId));
 }
}
