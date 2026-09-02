package com.example.carstore.controller;

import com.example.carstore.entity.Contract;
import com.example.carstore.entity.Orders;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.service.ContractService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
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
        contractService.assertCurrentUserCanAccess(order, auth);
        return contractData(order);
    }

    private Map<String, Object> contractData(Orders order) {
        Integer orderId = order.getId();
        Contract contract = contractService.getByOrderId(orderId);
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
        contractService.assertCurrentUserCanAccess(order, auth);
        return Map.of("success", true, "data", contractService.getPayments(orderId));
    }

    @GetMapping
    public Map<String, Object> list(
            Authentication auth,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (auth == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập.");
        }
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (page != null || size != null) {
            validatePagination(page, size);
            Page<Contract> result = admin
                    ? contractService.getAll(PageRequest.of(page, size))
                    : contractService.getByCustomer(auth.getName(), PageRequest.of(page, size));
            List<?> data = contractService.toResponses(result.getContent());
            return Map.of(
                    "success", true,
                    "data", data,
                    "count", data.size(),
                    "page", result.getNumber(),
                    "size", result.getSize(),
                    "totalPages", result.getTotalPages(),
                    "totalElements", result.getTotalElements());
        }
        List<Contract> contracts = admin ? contractService.getAll() : contractService.getByCustomer(auth.getName());
        return Map.of("success", true, "data", contractService.toResponses(contracts), "count", contracts.size());
    }

    // Giữ tương thích với các unit test/lời gọi Java cũ.
    public Map<String, Object> list(Authentication auth) {
        return list(auth, null, null);
    }

    @PutMapping("/manage/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Contract payload, Authentication auth) {
        boolean admin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!admin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Bạn không có quyền cập nhật hợp đồng.");
        }
        return Map.of("success", true, "data", contractService.toResponse(contractService.update(id, payload)));
    }

    private void validatePagination(Integer page, Integer size) {
        if (page == null || size == null || page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "page phải từ 0 và size phải trong khoảng 1 đến 100.");
        }
    }
}
