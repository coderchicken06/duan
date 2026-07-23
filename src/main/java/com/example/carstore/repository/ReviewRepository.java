package com.example.carstore.repository;

import com.example.carstore.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Integer> {
    List<Review> findByCarIdOrderByReviewDateDesc(Integer carId);
    boolean existsByCarIdAndUsername(Integer carId, String username);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.carId = :carId")
    Double averageRatingByCarId(@Param("carId") Integer carId);
}
