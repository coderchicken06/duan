package com.example.carstore.controller;

import com.example.carstore.entity.Quotation;
import com.example.carstore.service.QuotationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestQuotationController {

    private final QuotationService quotationService;

    public RestQuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities()
                .stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    // 1. Lấy tất cả báo giá (Admin) hoặc của riêng mình (Customer)
    @GetMapping
    public Map<String, Object> getAll(Authentication auth) {
        if (auth == null) return fail("Not authenticated");

        List<Quotation> list = isAdmin(auth)
                ? quotationService.getAll()
                : quotationService.getByCustomer(auth.getName());

        return Map.of("success", true, "data", list, "count", list.size());
    }

    // 2. Lấy báo giá cá nhân của khách hàng đã đăng nhập
    @GetMapping("/my-quotations")
    public Map<String, Object> getMyQuotations(Authentication auth) {
        if (auth == null) return fail("Not authenticated");

        List<Quotation> list = quotationService.getByCustomer(auth.getName());
        return Map.of("success", true, "data", list, "count", list.size());
    }

    // 3. Khách hàng gửi yêu cầu báo giá
    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> payload, Authentication auth) {
        if (auth == null) return fail("Not authenticated");

        try {
            Integer carId = Integer.parseInt(payload.get("carId").toString());
            Double carPrice = Double.parseDouble(payload.get("carPrice").toString());
            String note = payload.get("note") != null ? payload.get("note").toString() : "";

            Quotation quotation = quotationService.createQuotation(auth.getName(), carId, carPrice, note);
            return Map.of("success", true, "message", "Tạo yêu cầu báo giá thành công", "data", quotation);
        } catch (Exception e) {
            return fail(e.getMessage());
        }
    }

    // 4. Admin duyệt/cập nhật giảm giá & trạng thái báo giá
    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable int id,
                                     @RequestBody Map<String, Object> payload,
                                     Authentication auth) {
        if (!isAdmin(auth)) return fail("Access denied");

        try {
            Double discount = payload.get("discount") != null 
                    ? Double.parseDouble(payload.get("discount").toString()) 
                    : null;
            String status = payload.get("status") != null 
                    ? payload.get("status").toString() 
                    : null;

            Quotation updated = quotationService.updateDiscountAndStatus(id, discount, status);
            return Map.of("success", true, "message", "Cập nhật báo giá thành công", "data", updated);
        } catch (Exception e) {
            return fail(e.getMessage());
        }
    }

    // 5. Admin xóa báo giá
    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable int id, Authentication auth) {
        if (!isAdmin(auth)) return fail("Access denied");

        try {
            quotationService.deleteQuotation(id);
            return Map.of("success", true, "message", "Xóa báo giá thành công");
        } catch (Exception e) {
            return fail(e.getMessage());
        }
    }

    private Map<String, Object> fail(String message) {
        return Map.of("success", false, "message", message);
    }
}