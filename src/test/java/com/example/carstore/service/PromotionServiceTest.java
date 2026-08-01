package com.example.carstore.service;

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

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
}
