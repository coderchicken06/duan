package com.example.carstore.service;

import com.example.carstore.repository.SupportRequestRepository;
import com.example.carstore.entity.SupportRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SupportRequestServiceTest {

    private SupportRequestService service;
    private SupportRequestRepository repository;

    @BeforeEach
    void setUp() {
        repository = mock(SupportRequestRepository.class);
        service = new SupportRequestService(repository);
    }

    @Test
    void rejectsInvalidPhoneNumber() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createSupport("Nguyễn Văn A", "123", "chat", "Cần hỗ trợ", null));

        assertEquals("Số điện thoại không hợp lệ, vui lòng nhập 10 chữ số bắt đầu bằng số 0.", error.getMessage());
    }

    @Test
    void acceptsAndNormalizesSupportedVietnamesePhoneFormats() {
        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getName()).thenReturn("user1");
        when(repository.save(any(SupportRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        for (String phone : new String[]{"0941895900", "84941895900", "+84941895900"}) {
            SupportRequest saved = service.createSupport(
                    "Nguyễn Văn A", phone, "chat", "Cần hỗ trợ", auth);
            assertEquals("0941895900", saved.getPhone());
        }

        verify(repository, times(3)).save(any(SupportRequest.class));
    }

    @Test
    void rejectsAppointmentInThePast() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", "Toyota Camry",
                        "Bảo dưỡng định kỳ", LocalDate.now().minusDays(1).toString(),
                        "09:00", null));

        assertEquals("Thời gian hẹn không thể ở trong quá khứ!", error.getMessage());
    }

    @Test
    void rejectsAppointmentsOutsideShowroomHours() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", "Xe của khách",
                        "Bảo dưỡng định kỳ", LocalDate.now().plusDays(1).toString(),
                        "04:23", null));

        assertEquals("Showroom chỉ tiếp nhận lịch hẹn trong khung giờ từ 07:30 đến 18:30!", error.getMessage());
    }

    @Test
    void acceptsTomorrowAppointmentWithinShowroomHours() {
        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getName()).thenReturn("user1");
        when(repository.save(any(SupportRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SupportRequest saved = service.createServiceBooking(
                "Nguyễn Văn A", "+84912345678", "Toyota Camry",
                "Bảo dưỡng định kỳ", LocalDate.now().plusDays(1).toString(),
                "09:00", auth);

        assertEquals(LocalDate.now().plusDays(1), saved.getAppointmentDate());
        assertEquals(java.time.LocalTime.of(9, 0), saved.getAppointmentTime());
        verify(repository).save(any(SupportRequest.class));
    }

    @Test
    void rejectsOverlongCarInformation() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", "A".repeat(256),
                        "Bảo dưỡng định kỳ", null, null, null));

        assertEquals("Thông tin xe không được vượt quá 255 ký tự.", error.getMessage());
    }

    @Test
    void rejectsStatusChangesAfterRequestIsDoneOrCancelled() {
        SupportRequest request = new SupportRequest();
        request.setStatus(SupportRequestService.STATUS_DONE);
        when(repository.findById(1)).thenReturn(Optional.of(request));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.updateStatus(1, SupportRequestService.STATUS_PROCESSING));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatus());
        assertEquals("Yêu cầu đã kết thúc, không thể thay đổi trạng thái.", error.getReason());
        verify(repository, never()).save(any());
    }

    @Test
    void rejectsPendingOrCancelledAfterProcessingBegins() {
        SupportRequest request = new SupportRequest();
        request.setStatus(SupportRequestService.STATUS_PROCESSING);
        when(repository.findById(1)).thenReturn(Optional.of(request));

        for (String target : new String[]{SupportRequestService.STATUS_PENDING, SupportRequestService.STATUS_CANCELLED}) {
            ResponseStatusException error = assertThrows(ResponseStatusException.class,
                    () -> service.updateStatus(1, target));
            assertEquals(HttpStatus.BAD_REQUEST, error.getStatus());
            assertEquals("Yêu cầu đang được xử lý, không thể hủy hoặc quay lại trạng thái chờ.", error.getReason());
        }
        verify(repository, never()).save(any());
    }

    @Test
    void requiresProcessingBeforeRequestCanBeCompleted() {
        SupportRequest request = new SupportRequest();
        request.setStatus(SupportRequestService.STATUS_PENDING);
        when(repository.findById(1)).thenReturn(Optional.of(request));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.updateStatus(1, SupportRequestService.STATUS_DONE));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatus());
        assertEquals("Yêu cầu phải chuyển sang Đang xử lý trước khi hoàn tất.", error.getReason());
        verify(repository, never()).save(any());
    }
}
