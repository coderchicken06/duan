package com.example.carstore.repository;

import com.example.carstore.entity.PromotionCar;
import com.example.carstore.entity.PromotionCarId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionCarRepository extends JpaRepository<PromotionCar, PromotionCarId> {
    void deleteByPromotionIdAndCarId(Integer promotionId, Integer carId);
    void deleteByPromotionId(Integer promotionId);
    List<PromotionCar> findByPromotionId(Integer promotionId);
}
