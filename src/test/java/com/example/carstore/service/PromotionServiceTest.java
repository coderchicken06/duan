package com.example.carstore.service;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.Promotion;
import com.example.carstore.entity.PromotionCar;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.PromotionCarRepository;
import com.example.carstore.repository.PromotionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PromotionServiceTest {
    @Mock private PromotionRepository promotionRepository;
    @Mock private PromotionCarRepository promotionCarRepository;
    @Mock private CarRepository carRepository;

    private PromotionService service;

    @BeforeEach
    void setUp() {
        service = new PromotionService(promotionRepository, promotionCarRepository, carRepository);
    }

    @Test
    void activeForCarOrdersImmutableRepositoryResultByActualDiscount() {
        Car car = new Car();
        car.setPrice(1_000_000_000D);
        Promotion fixed = promotion(1, "FIXED", 150_000_000D);
        Promotion percent = promotion(2, "PERCENT", 20D);
        when(promotionRepository.findActiveByCarId(eq(7), any(java.util.Date.class)))
                .thenReturn(List.of(fixed, percent));
        when(carRepository.findById(7)).thenReturn(Optional.of(car));

        List<Promotion> result = service.activeForCar(7);

        assertSame(percent, result.get(0));
        assertSame(fixed, result.get(1));
    }

    @Test
    void priceAfterPromotionUsesLargestActualDiscountWithoutLoadingCarAgain() {
        Promotion fixed = promotion(1, "FIXED", 150_000_000D);
        Promotion percent = promotion(2, "PERCENT", 20D);
        when(promotionRepository.findActiveByCarId(eq(7), any(java.util.Date.class)))
                .thenReturn(List.of(fixed, percent));

        double result = service.priceAfterPromotion(7, 1_000_000_000D);

        assertEquals(800_000_000D, result, 0.001D);
        verify(carRepository, never()).findById(anyInt());
    }

    @Test
    void saveRejectsPastStartDate() {
        Promotion promotion = validPromotion();
        promotion.setStartDate(java.sql.Date.valueOf(LocalDate.now().minusDays(1)));
        promotion.setEndDate(java.sql.Date.valueOf(LocalDate.now().plusDays(1)));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.save(promotion));

        assertEquals("Ngày bắt đầu không được trước ngày hiện tại.", error.getMessage());
        verify(promotionRepository, never()).save(any());
    }

    @Test
    void saveRejectsPastEndDate() {
        Promotion promotion = validPromotion();
        promotion.setEndDate(java.sql.Date.valueOf(LocalDate.now().minusDays(1)));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.save(promotion));

        assertEquals("Ngày kết thúc không được trước ngày hiện tại.", error.getMessage());
        verify(promotionRepository, never()).save(any());
    }

    @Test
    void saveAcceptsToday() {
        Promotion promotion = validPromotion();
        promotion.setStartDate(java.sql.Date.valueOf(LocalDate.now()));
        promotion.setEndDate(java.sql.Date.valueOf(LocalDate.now()));
        when(promotionRepository.save(promotion)).thenReturn(promotion);

        Promotion result = service.save(promotion);

        assertSame(promotion, result);
        verify(promotionRepository).save(promotion);
    }

    @Test
    void updateAcceptsOriginalPastStartDateForActivePromotion() {
        Promotion promotion = validPromotion();
        promotion.setId(3);
        promotion.setStartDate(java.sql.Date.valueOf(LocalDate.now().minusDays(1)));
        promotion.setEndDate(java.sql.Date.valueOf(LocalDate.now().plusDays(1)));
        when(promotionRepository.save(promotion)).thenReturn(promotion);

        Promotion result = service.save(promotion);

        assertSame(promotion, result);
        verify(promotionRepository).save(promotion);
    }

    @Test
    void assignToCarReplacesPreviousCar() {
        when(promotionRepository.existsById(3)).thenReturn(true);
        when(carRepository.existsById(2)).thenReturn(true);
        when(promotionCarRepository.findByPromotionId(3)).thenReturn(List.of(new PromotionCar(3, 1)));

        service.assignToCar(3, 2);

        verify(promotionCarRepository).deleteByPromotionId(3);
        verify(promotionCarRepository).flush();
        ArgumentCaptor<PromotionCar> captor = ArgumentCaptor.forClass(PromotionCar.class);
        verify(promotionCarRepository).save(captor.capture());
        assertEquals(2, captor.getValue().getCarId());
    }

    @Test
    void assignToCarKeepsExistingIdenticalAssignment() {
        when(promotionRepository.existsById(3)).thenReturn(true);
        when(carRepository.existsById(2)).thenReturn(true);
        when(promotionCarRepository.findByPromotionId(3)).thenReturn(List.of(new PromotionCar(3, 2)));

        service.assignToCar(3, 2);

        verify(promotionCarRepository, never()).deleteByPromotionId(anyInt());
        verify(promotionCarRepository, never()).save(any());
    }

    @Test
    void applyToCarUsesSingleCarAssignmentSemantics() {
        when(promotionRepository.existsById(3)).thenReturn(true);
        when(carRepository.existsById(2)).thenReturn(true);
        when(promotionCarRepository.findByPromotionId(3)).thenReturn(List.of(new PromotionCar(3, 1)));

        service.applyToCar(3, 2);

        verify(promotionCarRepository).deleteByPromotionId(3);
        verify(promotionCarRepository).flush();
        ArgumentCaptor<PromotionCar> captor = ArgumentCaptor.forClass(PromotionCar.class);
        verify(promotionCarRepository).save(captor.capture());
        assertEquals(2, captor.getValue().getCarId());
    }

    @Test
    void stopApplyingRemovesCarAssignment() {
        when(promotionRepository.existsById(3)).thenReturn(true);

        service.stopApplying(3);

        verify(promotionCarRepository).deleteByPromotionId(3);
    }

    private Promotion promotion(Integer id, String type, double value) {
        Promotion promotion = new Promotion();
        promotion.setId(id);
        promotion.setType(type);
        promotion.setValue(value);
        return promotion;
    }

    private Promotion validPromotion() {
        Promotion promotion = promotion(null, "PERCENT", 10D);
        promotion.setName("Khuyến mãi hợp lệ");
        return promotion;
    }
}
