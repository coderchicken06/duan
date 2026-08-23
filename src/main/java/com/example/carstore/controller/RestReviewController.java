package com.example.carstore.controller;

import com.example.carstore.entity.Review;
import com.example.carstore.repository.ReviewRepository;
import com.example.carstore.service.ReviewService;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class RestReviewController {
    private final ReviewRepository reviewRepo;
    private final ReviewService reviewService;
    public RestReviewController(ReviewRepository reviewRepo, ReviewService reviewService) {
        this.reviewRepo = reviewRepo;
        this.reviewService = reviewService;
    }

    @GetMapping("/car/{carId}")
    public Map<String,Object> byCar(@PathVariable Integer carId) {
        List<Review> reviews=reviewRepo.findByCarIdOrderByReviewDateDesc(carId);
        double average=reviewRepo.averageRatingByCarId(carId);
        return Map.of("success",true,"data",reviews,"count",reviews.size(),"average",average);
    }

    @GetMapping("/my-reviewed-cars")
    public List<Long> myReviewedCars(Authentication auth) {
        if (auth == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập.");
        }
        return reviewRepo.findAll().stream()
                .filter(review -> auth.getName().equals(review.getUsername()))
                .map(Review::getCarId)
                .filter(java.util.Objects::nonNull)
                .map(Integer::longValue)
                .distinct()
                .toList();
    }

    @PostMapping("/car/{carId}")
    public Map<String,Object> create(@PathVariable Integer carId, @RequestBody Review payload, Authentication auth) {
        if(auth==null) throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập.");
        return Map.of("success",true,"data",reviewService.create(carId, payload, auth.getName()));
    }

    @PutMapping("/{id}")
    public Map<String,Object> update(@PathVariable Integer id, @RequestBody Review payload, Authentication auth) {
        if(auth==null) throw new IllegalArgumentException("Vui lòng đăng nhập.");
        Review review=reviewRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Không tìm thấy đánh giá."));
        if(!auth.getName().equals(review.getUsername())) throw new IllegalArgumentException("Bạn chỉ được sửa đánh giá của chính mình.");
        validate(payload);
        review.setRating(payload.getRating()); review.setComment(payload.getComment().trim()); review.setReviewDate(new Date());
        return Map.of("success",true,"data",reviewRepo.save(review));
    }

    @DeleteMapping("/{id}")
    public Map<String,Object> delete(@PathVariable Integer id, Authentication auth) {
        if(auth==null) throw new IllegalArgumentException("Vui lòng đăng nhập.");
        Review review=reviewRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Không tìm thấy đánh giá."));
        if(!auth.getName().equals(review.getUsername())) throw new IllegalArgumentException("Bạn chỉ được xóa đánh giá của chính mình.");
        reviewRepo.delete(review);
        return Map.of("success",true,"message","Đã xóa đánh giá.");
    }

    private void validate(Review payload) {
        if(payload==null || payload.getRating()==null || payload.getRating()<1 || payload.getRating()>5)
            throw new IllegalArgumentException("Đánh giá phải từ 1 đến 5 sao.");
        if(!StringUtils.hasText(payload.getComment()))
            throw new IllegalArgumentException("Nội dung đánh giá không được để trống.");
        if(payload.getComment().trim().length()>1000)
            throw new IllegalArgumentException("Nội dung đánh giá không được vượt quá 1000 ký tự.");
    }
}
