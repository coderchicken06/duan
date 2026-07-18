package com.example.carstore.repository;

import com.example.carstore.entity.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CarImageRepository extends JpaRepository<CarImage, Integer> {
    @Query(value = "SELECT id, car_id, image_url, sort_order, is_primary " +
            "FROM dbo.CarImage WHERE car_id = :carId " +
            "ORDER BY is_primary DESC, sort_order ASC, id ASC", nativeQuery = true)
    List<CarImage> findImagesByCarId(@Param("carId") Integer carId);
    boolean existsByCarIdAndImageUrl(Integer carId, String imageUrl);
    @Transactional
    void deleteByCarId(Integer carId);
}
