package com.example.carstore.service;

import com.example.carstore.entity.Review;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.ReviewRepository;
import com.example.carstore.util.OrderStatus;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;

@Service
public class ReviewService {
    private static final String PURCHASE_REQUIRED_MESSAGE =
            "Bạn chỉ có thể đánh giá mẫu xe này sau khi đã mua và nhận xe thành công.";

    private final ReviewRepository reviewRepo;
    private final OrderRepository orderRepo;
    private final CarRepository carRepo;

    public ReviewService(ReviewRepository reviewRepo, OrderRepository orderRepo, CarRepository carRepo) {
        this.reviewRepo = reviewRepo;
        this.orderRepo = orderRepo;
        this.carRepo = carRepo;
    }

    public Review create(Integer carId, Review payload, String username) {
        if (!carRepo.existsById(carId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy xe.");
        }
        validate(payload);
        boolean purchased = orderRepo.existsCompletedPurchase(username, carId, OrderStatus.DELIVERED)
                || orderRepo.existsCompletedPurchase(username, carId, "COMPLETED");
        if (!purchased) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, PURCHASE_REQUIRED_MESSAGE);
        }
        if (reviewRepo.existsByCarIdAndUsername(carId, username)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn đã gửi đánh giá cho mẫu xe này rồi.");
        }

        Review review = new Review();
        review.setCarId(carId);
        review.setUsername(username);
        review.setRating(payload.getRating());
        review.setComment(payload.getComment().trim());
        review.setReviewDate(new Date());
        return reviewRepo.save(review);
    }

    private void validate(Review payload) {
        if (payload == null || payload.getRating() == null || payload.getRating() < 1 || payload.getRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đánh giá phải từ 1 đến 5 sao.");
        }
        if (!StringUtils.hasText(payload.getComment())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nội dung đánh giá không được để trống.");
        }
        if (payload.getComment().trim().length() > 1000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nội dung đánh giá không được vượt quá 1000 ký tự.");
        }
    }
}
