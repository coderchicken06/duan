package com.example.carstore.controller;

import com.example.carstore.entity.Contract;
import com.example.carstore.entity.Orders;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.service.ContractService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class RestContractController {
    private final ContractService contractService;
    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final AccountRepository accountRepo;

    public RestContractController(ContractService contractService, OrderRepository orderRepo,
            OrderDetailRepository detailRepo, AccountRepository accountRepo) {
        this.contractService = contractService;
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.accountRepo = accountRepo;
    }

    @GetMapping("/{orderId}")
    public Map<String, Object> getByOrder(@PathVariable Integer orderId, Authentication auth) {
        Orders order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        boolean admin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (auth == null || (!admin && !order.getUsername().equals(auth.getName()))) {
            throw new IllegalArgumentException("Bạn không có quyền xem hợp đồng này.");
        }
        Contract contract;
        try {
            contract = contractService.getByOrderId(orderId);
        } catch (IllegalArgumentException missing) {
            double total = detailRepo.findByOrderId(orderId).stream()
                    .mapToDouble(d -> d.getPrice() * d.getQuantity()).sum();
            contract = contractService.createForOrder(order, total);
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("contract", contract);
        data.put("order", order);
        data.put("customer", accountRepo.findById(order.getUsername()).orElse(null));
        data.put("details", detailRepo.findByOrderId(orderId));
        data.put("payments", contractService.getPayments(orderId));
        return Map.of("success", true, "data", data);
    }

    @GetMapping("/{orderId}/payments")
    public Map<String, Object> getPayments(@PathVariable Integer orderId, Authentication auth) {
        Orders order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));
        boolean admin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (auth == null || (!admin && !order.getUsername().equals(auth.getName()))) {
            throw new IllegalArgumentException("Bạn không có quyền xem thanh toán này.");
        }
        return Map.of("success", true, "data", contractService.getPayments(orderId));
    }

    @GetMapping
    public Map<String, Object> list(Authentication auth) {
        if (auth == null) throw new IllegalArgumentException("Vui lòng đăng nhập.");
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        List<Contract> contracts = admin ? contractService.getAll() : contractService.getByCustomer(auth.getName());
        return Map.of("success", true, "data", contracts, "count", contracts.size());
    }

    @PutMapping("/manage/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Contract payload, Authentication auth) {
        boolean admin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!admin) throw new IllegalArgumentException("Bạn không có quyền cập nhật hợp đồng.");
        return Map.of("success", true, "data", contractService.update(id, payload));
    }
}
