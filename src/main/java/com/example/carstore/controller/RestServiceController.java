package com.example.carstore.controller;

import com.example.carstore.entity.SupportRequest;
import com.example.carstore.dto.SupportRequestCreateDto;
import com.example.carstore.service.SupportRequestService;
import com.example.carstore.util.ResponseUtils;
import com.example.carstore.util.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestServiceController {

    private final SupportRequestService supportRequestService;

    public RestServiceController(SupportRequestService supportRequestService) {
        this.supportRequestService = supportRequestService;
    }

    @GetMapping
    public Map<String, Object> getAllSupportRequests(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null && size == null) {
            return getAllSupportRequests();
        }
        validatePagination(page, size);
        Page<SupportRequest> result = supportRequestService.findAll(PageRequest.of(page, size));
        return Map.of(
                "success", true,
                "data", result.getContent(),
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalPages", result.getTotalPages(),
                "totalElements", result.getTotalElements());
    }

    // Giữ tương thích với các lời gọi Java và payload cũ khi không phân trang.
    public Map<String, Object> getAllSupportRequests() {
        return Map.of(
                "success", true,
                "data", supportRequestService.findAll()
        );
    }

    @GetMapping("/{id}")
    public Map<String, Object> getSupportRequest(@PathVariable int id) {
        java.util.Optional<SupportRequest> requestOpt = supportRequestService.findById(id);
        if (requestOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không tìm thấy yêu cầu hỗ trợ.");
        }
        return Map.of("success", true, "data", requestOpt.get());
    }

    @GetMapping("/my")
    public Map<String, Object> getMySupportRequests(Authentication auth) {
        return Map.of(
                "success", true,
                "data", supportRequestService.findHistory(null, auth)
        );
    }

    @PostMapping
    public ResponseEntity<?> createSupportRequest(
            @RequestBody SupportRequestCreateDto request,
            Authentication auth) {

        if (!SecurityUtils.isLoggedIn(auth)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseUtils.fail("Bạn cần đăng nhập để gửi yêu cầu hỗ trợ."));
        }

        if (request == null) {
            return ResponseEntity.badRequest().body(ResponseUtils.fail("Thông tin yêu cầu hỗ trợ là bắt buộc."));
        }

        if (!hasText(request.getName())) {
            return ResponseEntity.badRequest().body(ResponseUtils.fail("Họ tên là bắt buộc."));
        }

        if (!hasText(request.getPhone())) {
            return ResponseEntity.badRequest().body(ResponseUtils.fail("Số điện thoại là bắt buộc."));
        }

        if (!hasText(request.getContent())) {
            return ResponseEntity.badRequest().body(ResponseUtils.fail("Nội dung yêu cầu là bắt buộc."));
        }
        if (!hasText(request.getType())) {
            request.setType("chat");
        }

        try {
            SupportRequest saved;
            if ("service".equalsIgnoreCase(request.getType())) {
                saved = supportRequestService.createServiceBooking(
                        request.getName(), request.getPhone(), request.getCarInfo(), request.getServiceType(),
                        request.getAppointmentDate() == null ? null : request.getAppointmentDate().toString(),
                        request.getAppointmentTime() == null ? null : request.getAppointmentTime().toString(), auth);
            } else {
                SupportRequest entity = new SupportRequest();
                entity.setName(request.getName());
                entity.setPhone(request.getPhone());
                entity.setType(request.getType());
                entity.setContent(request.getContent());
                entity.setCarInfo(request.getCarInfo());
                saved = supportRequestService.createFromRequest(entity, auth);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "service".equalsIgnoreCase(saved.getType())
                            ? "Đặt lịch dịch vụ thành công" : "Gửi yêu cầu hỗ trợ thành công",
                    "id", saved.getId()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ResponseUtils.fail(ex.getMessage()));
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

        @PutMapping("/{id}/status")
        public Map<String, Object> updateSupportStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> payload,
            Authentication auth) {

        if (!SecurityUtils.isAdmin(auth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Bạn không có quyền cập nhật yêu cầu hỗ trợ.");
        }

        String status = payload == null ? null : payload.get("status");

        if (status == null || status.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Trạng thái yêu cầu là bắt buộc.");
        }

        boolean updated = supportRequestService.updateStatus(id, status);

        if (!updated) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không tìm thấy yêu cầu hỗ trợ.");
        }

        return ResponseUtils.ok("Support request status updated successfully");
    }

        @DeleteMapping("/{id}")
        public Map<String, Object> deleteSupportRequest(
            @PathVariable int id,
            Authentication auth) {

        if (!SecurityUtils.isAdmin(auth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Bạn không có quyền xóa yêu cầu hỗ trợ.");
        }

        boolean deleted = supportRequestService.delete(id);

        if (!deleted) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không tìm thấy yêu cầu hỗ trợ.");
        }

        return ResponseUtils.ok("Support request deleted successfully");
    }

    @GetMapping("/type/{type}")
    public Map<String, Object> getSupportRequestsByType(
            @PathVariable String type,
            Authentication auth) {

        if (!SecurityUtils.isAdmin(auth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Bạn không có quyền xem danh sách yêu cầu này.");
        }

        return Map.of(
                "success", true,
                "data", supportRequestService.findHistory(type, auth)
        );
    }

    @GetMapping("/stats")
    public Map<String, Object> getSupportStats(Authentication auth) {
        if (!SecurityUtils.isAdmin(auth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Bạn không có quyền xem thống kê hỗ trợ.");
        }

        long total = supportRequestService.count();
        long pending = supportRequestService.countByStatus(SupportRequestService.STATUS_PENDING)
                + supportRequestService.countByStatus(SupportRequestService.STATUS_PROCESSING);
        long resolved = supportRequestService.countByStatus(SupportRequestService.STATUS_DONE);

        return Map.of(
                "success", true,
                "total", total,
                "pending", pending,
                "resolved", resolved
        );
    }

    private void validatePagination(Integer page, Integer size) {
        if (page == null || size == null || page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "page phải từ 0 và size phải trong khoảng 1 đến 100.");
        }
    }
}
