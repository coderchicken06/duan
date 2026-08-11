package com.example.carstore.service;

import com.example.carstore.repository.SupportRequestRepository;
import com.example.carstore.entity.SupportRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;

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

        assertEquals("Số điện thoại phải có 9 chữ số, 10 chữ số bắt đầu bằng 0, hoặc bắt đầu bằng +84/84.", error.getMessage());
    }

    @Test
    void acceptsAndNormalizesSupportedVietnamesePhoneFormats() {
        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getName()).thenReturn("user1");
        when(repository.save(any(SupportRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        for (String phone : new String[]{"0941895900", "941895900", "84941895900", "+84941895900"}) {
            SupportRequest saved = service.createSupport(
                    "Nguyễn Văn A", phone, "chat", "Cần hỗ trợ", auth);
            assertEquals("+84941895900", saved.getPhone());
        }

        verify(repository, times(4)).save(any(SupportRequest.class));
    }

    @Test
    void rejectsAppointmentInThePast() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", "Toyota Camry",
                        "Bảo dưỡng định kỳ", LocalDate.now().minusDays(1).toString(),
                        "09:00", null));

        assertEquals("Ngày hẹn không được ở trong quá khứ.", error.getMessage());
    }

    @Test
    void rejectsPastTimeToday() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", "Xe của khách",
                        "Bảo dưỡng định kỳ", LocalDate.now().toString(),
                        "00:00", null));

        assertEquals("Giờ hẹn phải sau thời điểm hiện tại.", error.getMessage());
    }

    @Test
    void rejectsOverlongCarInformation() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", "A".repeat(256),
                        "Bảo dưỡng định kỳ", null, null, null));

        assertEquals("Thông tin xe không được vượt quá 255 ký tự.", error.getMessage());
    }
}
