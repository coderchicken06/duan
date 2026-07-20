package com.example.carstore.controller;

import com.example.carstore.entity.CarImage;
import com.example.carstore.service.CarImageService;
import com.example.carstore.util.ResponseUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cars/{carId}/images")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestCarImageController {
    private final CarImageService imageService;

    public RestCarImageController(CarImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping
    public ResponseEntity<?> getImages(@PathVariable Integer carId) {
        try {
            return ResponseEntity.ok(imageService.getImages(carId));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(404).body(ResponseUtils.fail(exception.getMessage()));
        }
    }

    @PostMapping
    public Map<String, Object> addImage(@PathVariable Integer carId, @RequestBody CarImage image) {
        try {
            return ResponseUtils.ok("Đã thêm ảnh", "data", imageService.addImage(carId, image));
        } catch (IllegalArgumentException exception) {
            return ResponseUtils.fail(exception.getMessage());
        }
    }

    @PutMapping("/{imageId}")
    public Map<String, Object> updateImage(@PathVariable Integer carId, @PathVariable Integer imageId, @RequestBody CarImage payload) {
        try {
            return ResponseUtils.ok("Đã cập nhật ảnh", "data",
                    imageService.updateImage(carId, imageId, payload));
        } catch (IllegalArgumentException exception) {
            return ResponseUtils.fail(exception.getMessage());
        }
    }

    @DeleteMapping("/{imageId}")
    public Map<String, Object> deleteImage(@PathVariable Integer carId, @PathVariable Integer imageId) {
        try {
            imageService.deleteImage(carId, imageId);
            return ResponseUtils.ok("Đã xóa ảnh");
        } catch (IllegalArgumentException exception) {
            return ResponseUtils.fail(exception.getMessage());
        }
    }
}
