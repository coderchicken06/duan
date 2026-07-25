package com.example.carstore.repository;

import com.example.carstore.entity.PromotionCar;
import com.example.carstore.entity.PromotionCarId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionCarRepository extends JpaRepository<PromotionCar, PromotionCarId> {
    void deleteByPromotionIdAndCarId(Integer promotionId, Integer carId);
    void deleteByPromotionId(Integer promotionId);
}
