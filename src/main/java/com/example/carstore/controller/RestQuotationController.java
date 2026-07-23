package com.example.carstore.controller;

import com.example.carstore.dto.QuotationRequestDto;
import com.example.carstore.entity.Quotation;
import com.example.carstore.entity.Orders;
import com.example.carstore.service.QuotationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestQuotationController {
    private final QuotationService service;

    public RestQuotationController(QuotationService service) {
        this.service = service;
    }

    private boolean admin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody QuotationRequestDto request, Authentication auth) {
        if (auth == null) return fail("Not authenticated");
        return Map.of("success", true, "message", "Tạo yêu cầu báo giá thành công",
                "data", service.create(auth.getName(), request));
    }

    @GetMapping({"/my", "/my-quotations"})
    public Map<String, Object> mine(Authentication auth) {
        if (auth == null) return fail("Not authenticated");
        List<Quotation> data = service.mine(auth.getName());
        return Map.of("success", true, "data", data, "count", data.size());
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id, Authentication auth) {
        if (auth == null) return fail("Not authenticated");
        Quotation quotation = service.get(id);
        if (!admin(auth) && !quotation.getCustomerUsername().equals(auth.getName())) {
            return fail("Bạn không có quyền xem báo giá.");
        }
        return Map.of("success", true, "data", quotation);
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id,
                                      @RequestBody QuotationRequestDto request,
                                      Authentication auth) {
        if (!admin(auth)) return fail("Access denied");
        return Map.of("success", true, "message", "Cập nhật báo giá thành công",
                "data", service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id, Authentication auth) {
        if (!admin(auth)) return fail("Access denied");
        service.deleteQuotation(id);
        return Map.of("success", true, "message", "Xóa báo giá thành công");
    }

    @PostMapping("/{id}/confirm")
    public Map<String, Object> confirm(@PathVariable Integer id, Authentication auth) {
        if (auth == null) return fail("Not authenticated");
        return Map.of("success", true, "data", service.confirm(id, auth.getName()));
    }

    @PostMapping("/{id}/convert-to-order")
    public Map<String, Object> convertToOrder(@PathVariable Integer id,
                                              @RequestBody QuotationRequestDto request,
                                              Authentication auth) {
        if (auth == null) return fail("Not authenticated");
        Orders order = service.convertToOrder(id, auth.getName(), request);
        return Map.of("success", true, "message", "Đã chuyển báo giá thành đơn hàng",
                "data", order);
    }

    @GetMapping
    public Map<String, Object> all(Authentication auth) {
        if (auth == null) return fail("Not authenticated");
        List<Quotation> data = admin(auth) ? service.all() : service.mine(auth.getName());
        return Map.of("success", true, "data", data, "count", data.size());
    }

    private Map<String, Object> fail(String message) {
        return Map.of("success", false, "message", message);
    }
}
