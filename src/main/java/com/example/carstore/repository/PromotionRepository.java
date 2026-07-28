package com.example.carstore.repository;
import com.example.carstore.entity.Promotion;import org.springframework.data.jpa.repository.JpaRepository;import org.springframework.data.jpa.repository.Query;import org.springframework.data.repository.query.Param;import java.util.*;
public interface PromotionRepository extends JpaRepository<Promotion,Integer>{
 @Query("SELECT p FROM Promotion p WHERE p.status=true AND (p.startDate IS NULL OR p.startDate<=:today) AND (p.endDate IS NULL OR p.endDate>=:today) ORDER BY p.startDate DESC")
 List<Promotion> findActive(@Param("today") Date today);
 @Query("SELECT p FROM Promotion p WHERE p.id IN (SELECT pc.promotionId FROM PromotionCar pc WHERE pc.carId=:carId) AND p.status=true AND (p.startDate IS NULL OR p.startDate<=:today) AND (p.endDate IS NULL OR p.endDate>=:today) ORDER BY p.value DESC")
 List<Promotion> findActiveByCarId(@Param("carId") Integer carId,@Param("today") Date today);
 boolean existsByCodeAndIdNot(String code,Integer id);
}
