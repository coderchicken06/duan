package com.example.carstore.service;

import com.example.carstore.entity.SupportRequest;
import com.example.carstore.repository.SupportRequestRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.util.SecurityUtils;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private static final Set<String> VALID_TYPES = Set.of(
            "chat", "consulting", "warranty", "service"
    );

    private final SupportRequestRepository supportRepo;
    private final CarRepository carRepo;

    public SupportRequestService(SupportRequestRepository supportRepo, CarRepository carRepo) {
        this.supportRepo = supportRepo;
        this.carRepo = carRepo;
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
        SupportRequest request = new SupportRequest(
                name.trim(), normalizePhone(phone), supportType, content.trim());
        request.setUsername(username);
        request.setStatus(STATUS_PENDING);

        return supportRepo.save(request);
    }

    public SupportRequest createServiceBooking(
            String name,
            String phone,
            Integer carId,
            String carInfo,
            String serviceType,
            String date,
            String time,
            Authentication auth) {

        validateCommonSupportInput(name, phone, "Yêu cầu đặt lịch dịch vụ");
        if (!StringUtils.hasText(carInfo)) {
            throw new IllegalArgumentException("Thông tin xe không được để trống.");
        }
        if (carInfo.trim().length() > 255) {
            throw new IllegalArgumentException("Thông tin xe không được vượt quá 255 ký tự.");
        }
        if (carId != null && !carRepo.existsById(carId)) {
            throw new IllegalArgumentException("Không tìm thấy xe cần đặt lịch.");
        }
        if (!StringUtils.hasText(serviceType)) {
            throw new IllegalArgumentException("Loại dịch vụ không được để trống.");
        }
        if (serviceType.trim().length() > 255) {
            throw new IllegalArgumentException("Loại dịch vụ không được vượt quá 255 ký tự.");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDate appointmentDate = parseDate(date);
        if (appointmentDate == null) {
            throw new IllegalArgumentException("Ngày hẹn không được để trống.");
        }
        if (appointmentDate.isBefore(now.toLocalDate())) {
            throw new IllegalArgumentException("Ngày hẹn không được ở trong quá khứ.");
        }

        LocalTime appointmentTime = parseTime(time);
        if (appointmentTime == null) {
            throw new IllegalArgumentException("Giờ hẹn không được để trống.");
        }
        if (!LocalDateTime.of(appointmentDate, appointmentTime).isAfter(now)) {
            throw new IllegalArgumentException("Giờ hẹn phải sau thời điểm hiện tại.");
        }

        String username = SecurityUtils.username(auth);
        if (!StringUtils.hasText(username)) {
            throw new IllegalArgumentException("Bạn cần đăng nhập để đặt lịch dịch vụ.");
        }

        SupportRequest request = new SupportRequest(
                name.trim(),
                normalizePhone(phone),
                "service",
                "Yêu cầu đặt lịch dịch vụ",
                carInfo.trim(),
                serviceType.trim(),
                appointmentDate,
                appointmentTime
        );

        request.setUsername(username);
        request.setCarId(carId);
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
        request.setName(request.getName().trim());
        request.setPhone(normalizePhone(request.getPhone()));
        request.setContent(request.getContent().trim());
        if (StringUtils.hasText(request.getCarInfo())) {
            if (request.getCarInfo().trim().length() > 255) {
                throw new IllegalArgumentException("Thông tin xe không được vượt quá 255 ký tự.");
            }
            request.setCarInfo(request.getCarInfo().trim());
        }
        request.setUsername(username);
        request.setStatus(STATUS_PENDING);
        return supportRepo.save(request);
    }

    private String defaultType(String type) {
        String normalized = StringUtils.hasText(type) ? type.trim().toLowerCase() : "chat";
        if (!VALID_TYPES.contains(normalized)) {
            throw new IllegalArgumentException("Loại yêu cầu không hợp lệ.");
        }
        return normalized;
    }

    private String normalizePhone(String phone) {
        return phone.trim().replaceAll("\\s+", "");
    }

    private void validateCommonSupportInput(String name, String phone, String content) {
        if (!StringUtils.hasText(name)) {
            throw new IllegalArgumentException("Tên không được để trống.");
        }
        if (!StringUtils.hasText(phone)) {
            throw new IllegalArgumentException("Số điện thoại không được để trống.");
        }
        String normalizedPhone = normalizePhone(phone);
        if (!normalizedPhone.matches("^\\+84[0-9]{9}$")) {
            throw new IllegalArgumentException("Số điện thoại phải có định dạng +84xxxxxxxxx.");
        }
        if (!StringUtils.hasText(content)) {
            throw new IllegalArgumentException("Nội dung không được để trống.");
        }
        if (name.trim().length() > 255) {
            throw new IllegalArgumentException("Họ tên không được vượt quá 255 ký tự.");
        }
        if (content.trim().length() > 1000) {
            throw new IllegalArgumentException("Nội dung không được vượt quá 1000 ký tự.");
        }
    }

    public List<SupportRequest> findAll() {
        return supportRepo.findAll();
    }

    public long count() {
        return supportRepo.count();
    }

    public long countByStatus(String status) {
        return supportRepo.countByStatusIgnoreCase(status);
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
