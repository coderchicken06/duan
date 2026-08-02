package com.example.carstore.service;

import com.example.carstore.dto.QuotationRequestDto;
import com.example.carstore.entity.Quotation;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.QuotationItemRepository;
import com.example.carstore.repository.QuotationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuotationServiceTest {
    @Mock private QuotationRepository quotationRepository;
    @Mock private CarRepository carRepository;
    @Mock private QuotationItemRepository quotationItemRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private OrderDetailRepository orderDetailRepository;
    @Mock private ContractService contractService;

    private QuotationService service;

    @BeforeEach
    void setUp() {
        service = new QuotationService(
                quotationRepository,
                carRepository,
                quotationItemRepository,
                orderRepository,
                orderDetailRepository,
                contractService);
    }

    @Test
    void updateRejectsStatusRollbackWhenQuotationIsConverted() {
        Quotation quotation = quotation(QuotationService.CONVERTED, null);
        when(quotationRepository.findById(1)).thenReturn(Optional.of(quotation));

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class,
                () -> service.update(1, requestWithStatus(QuotationService.APPROVED)));

        assertEquals(
                "Không thể thay đổi trạng thái báo giá đã chuyển thành đơn hàng.",
                error.getMessage());
        verify(quotationRepository, never()).save(quotation);
    }

    @Test
    void updateRejectsStatusRollbackWhenQuotationAlreadyHasOrder() {
        Quotation quotation = quotation(QuotationService.APPROVED, 42);
        when(quotationRepository.findById(1)).thenReturn(Optional.of(quotation));

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class,
                () -> service.update(1, requestWithStatus(QuotationService.PENDING)));

        assertEquals(
                "Không thể thay đổi trạng thái báo giá đã chuyển thành đơn hàng.",
                error.getMessage());
        verify(quotationRepository, never()).save(quotation);
    }

    private Quotation quotation(String status, Integer orderId) {
        Quotation quotation = new Quotation();
        quotation.setStatus(status);
        quotation.setOrderId(orderId);
        return quotation;
    }

    private QuotationRequestDto requestWithStatus(String status) {
        QuotationRequestDto request = new QuotationRequestDto();
        request.setStatus(status);
        return request;
    }
}
