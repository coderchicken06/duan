package com.example.carstore.service;

import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.SupportRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

class SupportRequestServiceTest {

    private SupportRequestService service;

    @BeforeEach
    void setUp() {
        service = new SupportRequestService(
                mock(SupportRequestRepository.class),
                mock(CarRepository.class));
    }

    @Test
    void rejectsInvalidPhoneNumber() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createSupport("Nguyễn Văn A", "123", "chat", "Cần hỗ trợ", null));

        assertEquals("Số điện thoại phải có định dạng +84xxxxxxxxx.", error.getMessage());
    }

    @Test
    void rejectsLocalPhoneFormatWithoutCountryCode() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createSupport(
                        "Nguyễn Văn A", "0912345678", "chat", "Cần hỗ trợ", null));

        assertEquals("Số điện thoại phải có định dạng +84xxxxxxxxx.", error.getMessage());
    }

    @Test
    void rejectsAppointmentInThePast() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", null, "Toyota Camry",
                        "Bảo dưỡng định kỳ", LocalDate.now().minusDays(1).toString(),
                        "09:00", null));

        assertEquals("Ngày hẹn không được ở trong quá khứ.", error.getMessage());
    }

    @Test
    void rejectsPastTimeToday() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", null, "Xe của khách",
                        "Bảo dưỡng định kỳ", LocalDate.now().toString(),
                        "00:00", null));

        assertEquals("Giờ hẹn phải sau thời điểm hiện tại.", error.getMessage());
    }

    @Test
    void rejectsOverlongCarInformation() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.createServiceBooking(
                        "Nguyễn Văn A", "+84912345678", null, "A".repeat(256),
                        "Bảo dưỡng định kỳ", null, null, null));

        assertEquals("Thông tin xe không được vượt quá 255 ký tự.", error.getMessage());
    }
}
