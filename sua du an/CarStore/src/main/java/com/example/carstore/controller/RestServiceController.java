package com.example.carstore.controller;

import com.example.carstore.entity.SupportRequest;
import com.example.carstore.service.SupportRequestService;
import com.example.carstore.util.ResponseUtils;
import com.example.carstore.util.SecurityUtils;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
            return ResponseUtils.fail("Support request not found");
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
    public Map<String, Object> createSupportRequest(
            @RequestBody SupportRequest request,
            Authentication auth) {

        if (!SecurityUtils.isLoggedIn(auth)) {
            return ResponseUtils.fail("Not authenticated");
        }

        if (request == null) {
            return ResponseUtils.fail("Support request is required");
        }

        if (!hasText(request.getName())) {
            return ResponseUtils.fail("Name is required");
        }

        if (!hasText(request.getPhone())) {
            return ResponseUtils.fail("Phone is required");
        }

        if (!hasText(request.getContent())) {
            return ResponseUtils.fail("Content is required");
        }
        if (!hasText(request.getType())) {
            request.setType("chat");
        }

        SupportRequest saved;
        if ("service".equalsIgnoreCase(request.getType())) {
            saved = supportRequestService.createServiceBooking(
                    request.getName(), request.getPhone(), request.getCarInfo(), request.getServiceType(),
                    request.getAppointmentDate() == null ? null : request.getAppointmentDate().toString(),
                    request.getAppointmentTime() == null ? null : request.getAppointmentTime().toString(), auth);
        } else {
            saved = supportRequestService.createFromRequest(request, auth);
        }

        return Map.of(
                "success", true,
                "message", "service".equalsIgnoreCase(saved.getType())
                        ? "Đặt lịch dịch vụ thành công" : "Gửi yêu cầu hỗ trợ thành công",
                "id", saved.getId()
        );
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
            return ResponseUtils.fail("Access denied");
        }

        String status = payload == null ? null : payload.get("status");

        if (status == null || status.trim().isEmpty()) {
            return ResponseUtils.fail("Status is required");
        }

        if (!supportRequestService.isValidStatus(status)) {
            return ResponseUtils.fail("Invalid status");
        }

        boolean updated = supportRequestService.updateStatus(id, status);

        if (!updated) {
            return ResponseUtils.fail("Support request not found");
        }

        return ResponseUtils.ok("Support request status updated successfully");
    }

        @DeleteMapping("/{id}")
        public Map<String, Object> deleteSupportRequest(
            @PathVariable int id,
            Authentication auth) {

        if (!SecurityUtils.isAdmin(auth)) {
            return ResponseUtils.fail("Access denied");
        }

        boolean deleted = supportRequestService.delete(id);

        if (!deleted) {
            return ResponseUtils.fail("Support request not found");
        }

        return ResponseUtils.ok("Support request deleted successfully");
    }

    @GetMapping("/type/{type}")
    public Map<String, Object> getSupportRequestsByType(
            @PathVariable String type,
            Authentication auth) {

        if (!SecurityUtils.isAdmin(auth)) {
            return ResponseUtils.fail("Access denied");
        }

        return Map.of(
                "success", true,
                "data", supportRequestService.findHistory(type, auth)
        );
    }

    @GetMapping("/stats")
    public Map<String, Object> getSupportStats(Authentication auth) {
        if (!SecurityUtils.isAdmin(auth)) {
            return ResponseUtils.fail("Access denied");
        }

        long total = supportRequestService.findAll().size();

        long pending = supportRequestService.findAll().stream()
                .filter(r -> SupportRequestService.STATUS_PENDING.equalsIgnoreCase(r.getStatus())
                        || SupportRequestService.STATUS_PROCESSING.equalsIgnoreCase(r.getStatus()))
                .count();

        long resolved = supportRequestService.findAll().stream()
                .filter(r -> SupportRequestService.STATUS_DONE.equalsIgnoreCase(r.getStatus()))
                .count();

        return Map.of(
                "success", true,
                "total", total,
                "pending", pending,
                "resolved", resolved
        );
    }
}