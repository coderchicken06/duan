package com.example.carstore.controller;

import com.example.carstore.entity.Review;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.ReviewRepository;
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
    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final CarRepository carRepo;
    public RestReviewController(ReviewRepository reviewRepo, OrderRepository orderRepo,
            OrderDetailRepository detailRepo, CarRepository carRepo) {
        this.reviewRepo=reviewRepo; this.orderRepo=orderRepo; this.detailRepo=detailRepo; this.carRepo=carRepo;
    }

    @GetMapping("/car/{carId}")
    public Map<String,Object> byCar(@PathVariable Integer carId) {
        List<Review> reviews=reviewRepo.findByCarIdOrderByReviewDateDesc(carId);
        double average=reviewRepo.averageRatingByCarId(carId);
        return Map.of("success",true,"data",reviews,"count",reviews.size(),"average",average);
    }

    @PostMapping("/car/{carId}")
    public Map<String,Object> create(@PathVariable Integer carId, @RequestBody Review payload, Authentication auth) {
        if(auth==null) throw new IllegalArgumentException("Vui lòng đăng nhập.");
        if(!carRepo.existsById(carId)) throw new IllegalArgumentException("Không tìm thấy xe.");
        validate(payload);
        boolean purchased=orderRepo.findByUsername(auth.getName()).stream()
                .filter(o->"DELIVERED".equals(o.getStatus()))
                .anyMatch(o->detailRepo.findByOrderId(o.getId()).stream().anyMatch(d->d.getCar()!=null&&carId.equals(d.getCar().getId())));
        if(!purchased) throw new IllegalArgumentException("Chỉ khách hàng đã nhận xe mới được đánh giá.");
        if(reviewRepo.existsByCarIdAndUsername(carId,auth.getName())) throw new IllegalArgumentException("Bạn đã đánh giá xe này.");
        Review review=new Review(); review.setCarId(carId); review.setUsername(auth.getName());
        review.setRating(payload.getRating()); review.setComment(payload.getComment().trim()); review.setReviewDate(new Date());
        return Map.of("success",true,"data",reviewRepo.save(review));
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
