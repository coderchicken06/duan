package com.example.carstore.service;

import com.example.carstore.entity.SupportRequest;
import com.example.carstore.repository.SupportRequestRepository;
import com.example.carstore.util.SecurityUtils;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Service
public class SupportRequestService {

    public static final String STATUS_PENDING = "Chờ xử lý";
    public static final String STATUS_PROCESSING = "Đang xử lý";
    public static final String STATUS_DONE = "Đã xử lý";
    public static final String STATUS_CANCELLED = "Đã hủy";

    private static final Set<String> VALID_STATUSES = Set.of(
            STATUS_PENDING,
            STATUS_PROCESSING,
            STATUS_DONE,
            STATUS_CANCELLED
    );

    private final SupportRequestRepository supportRepo;

    public SupportRequestService(SupportRequestRepository supportRepo) {
        this.supportRepo = supportRepo;
    }

    public boolean isValidStatus(String status) {
        return StringUtils.hasText(status) && VALID_STATUSES.contains(status.trim());
    }

    public SupportRequest createSupport(
            String name,
            String phone,
            String type,
            String content,
            Authentication auth) {

        validateCommonSupportInput(name, phone, content);
        String username = SecurityUtils.username(auth);
        if (!StringUtils.hasText(username)) {
            throw new IllegalArgumentException("Bạn cần đăng nhập để gửi yêu cầu hỗ trợ.");
        }

        String supportType = defaultType(type);
        SupportRequest request = new SupportRequest(name.trim(), phone.trim(), supportType, content.trim());
        request.setUsername(username);
        request.setStatus(STATUS_PENDING);

        return supportRepo.save(request);
    }

    public SupportRequest createServiceBooking(
            String name,
            String phone,
            String carInfo,
            String serviceType,
            String date,
            String time,
            Authentication auth) {

        validateCommonSupportInput(name, phone, "Yêu cầu đặt lịch dịch vụ");
        if (!StringUtils.hasText(carInfo)) {
            throw new IllegalArgumentException("Thông tin xe không được để trống.");
        }
        if (!StringUtils.hasText(serviceType)) {
            throw new IllegalArgumentException("Loại dịch vụ không được để trống.");
        }

        LocalDate appointmentDate = parseDate(date);
        if (appointmentDate == null) {
            throw new IllegalArgumentException("Ngày hẹn không được để trống.");
        }

        LocalTime appointmentTime = parseTime(time);
        if (appointmentTime == null) {
            throw new IllegalArgumentException("Giờ hẹn không được để trống.");
        }

        String username = SecurityUtils.username(auth);
        if (!StringUtils.hasText(username)) {
            throw new IllegalArgumentException("Bạn cần đăng nhập để đặt lịch dịch vụ.");
        }

        SupportRequest request = new SupportRequest(
                name.trim(),
                phone.trim(),
                "service",
                "Yêu cầu đặt lịch dịch vụ",
                carInfo.trim(),
                serviceType.trim(),
                appointmentDate,
                appointmentTime
        );

        request.setUsername(username);
        request.setStatus(STATUS_PENDING);

        return supportRepo.save(request);
    }

    public SupportRequest createFromRequest(SupportRequest request, Authentication auth) {
        if (request == null) {
            throw new IllegalArgumentException("Support request is required.");
        }
        validateCommonSupportInput(request.getName(), request.getPhone(), request.getContent());

        String username = SecurityUtils.username(auth);
        if (!StringUtils.hasText(username)) {
            throw new IllegalArgumentException("Bạn cần đăng nhập để gửi yêu cầu hỗ trợ.");
        }

        request.setType(defaultType(request.getType()));
        request.setUsername(username);
        request.setStatus(STATUS_PENDING);
        return supportRepo.save(request);
    }

    private String defaultType(String type) {
        return StringUtils.hasText(type) ? type.trim() : "chat";
    }

    private void validateCommonSupportInput(String name, String phone, String content) {
        if (!StringUtils.hasText(name)) {
            throw new IllegalArgumentException("Tên không được để trống.");
        }
        if (!StringUtils.hasText(phone)) {
            throw new IllegalArgumentException("Số điện thoại không được để trống.");
        }
        if (!StringUtils.hasText(content)) {
            throw new IllegalArgumentException("Nội dung không được để trống.");
        }
    }

    public List<SupportRequest> findAll() {
        return supportRepo.findAll();
    }

    public java.util.Optional<SupportRequest> findById(Integer id) {
        return supportRepo.findById(id);
    }

    public boolean updateStatus(Integer id, String status) {
        if (!isValidStatus(status)) {
            return false;
        }

        return supportRepo.findById(id).map(request -> {
            request.setStatus(status.trim());
            supportRepo.save(request);
            return true;
        }).orElse(false);
    }

    public boolean delete(Integer id) {
        if (!supportRepo.existsById(id)) {
            return false;
        }

        supportRepo.deleteById(id);
        return true;
    }

    public List<SupportRequest> findHistory(String type, Authentication auth) {
        if (SecurityUtils.isAdmin(auth)) {
            return StringUtils.hasText(type)
                    ? supportRepo.findByTypeIgnoreCase(type)
                    : supportRepo.findAll();
        }

        String username = SecurityUtils.username(auth);
        if (!StringUtils.hasText(username)) {
            return List.of();
        }

        return StringUtils.hasText(type)
                ? supportRepo.findByUsernameIgnoreCaseAndTypeIgnoreCase(username, type)
                : supportRepo.findByUsernameIgnoreCase(username);
    }

    private LocalDate parseDate(String date) {
        if (!StringUtils.hasText(date)) {
            return null;
        }
        try {
            return LocalDate.parse(date);
        } catch (Exception e) {
            throw new IllegalArgumentException("Định dạng ngày không hợp lệ. Vui lòng dùng yyyy-MM-dd.");
        }
    }

    private LocalTime parseTime(String time) {
        if (!StringUtils.hasText(time)) {
            return null;
        }
        try {
            return LocalTime.parse(time);
        } catch (Exception e) {
            throw new IllegalArgumentException("Định dạng giờ không hợp lệ. Vui lòng dùng HH:mm.");
        }
    }

    public boolean markDone(Integer id) {
        return supportRepo.findById(id).map(request -> {
            request.setStatus(STATUS_DONE);
            supportRepo.save(request);
            return true;
        }).orElse(false);
    }
}