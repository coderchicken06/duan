package com.example.carstore.controller;

import com.example.carstore.entity.CarImage;
import com.example.carstore.repository.CarImageRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.util.ResponseUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars/{carId}/images")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestCarImageController {
    private final CarImageRepository imageRepo;
    private final CarRepository carRepo;

    public RestCarImageController(CarImageRepository imageRepo, CarRepository carRepo) {
        this.imageRepo = imageRepo;
        this.carRepo = carRepo;
    }

    @GetMapping
    public List<CarImage> getImages(@PathVariable Integer carId) {
        return imageRepo.findImagesByCarId(carId);
    }

    @PostMapping
    public Map<String, Object> addImage(@PathVariable Integer carId, @RequestBody CarImage image) {
        if (!carRepo.existsById(carId)) return ResponseUtils.fail("Không tìm thấy xe");
        if (image.getImageUrl() == null || image.getImageUrl().trim().isEmpty())
            return ResponseUtils.fail("Ảnh không được để trống");
        image.setId(null);
        image.setCarId(carId);
        image.setImageUrl(image.getImageUrl().trim());
        if (imageRepo.existsByCarIdAndImageUrl(carId, image.getImageUrl()))
            return ResponseUtils.fail("Ảnh này đã tồn tại");
        return ResponseUtils.ok("Đã thêm ảnh", "data", imageRepo.save(image));
    }

    @PutMapping("/{imageId}")
    public Map<String, Object> updateImage(@PathVariable Integer carId, @PathVariable Integer imageId, @RequestBody CarImage payload) {
        return imageRepo.findById(imageId).filter(x -> x.getCarId().equals(carId)).map(existing -> {
            if (payload.getImageUrl() != null && !payload.getImageUrl().trim().isEmpty()) existing.setImageUrl(payload.getImageUrl().trim());
            existing.setSortOrder(payload.getSortOrder());
            existing.setPrimaryImage(payload.getPrimaryImage());
            return ResponseUtils.ok("Đã cập nhật ảnh", "data", imageRepo.save(existing));
        }).orElse(ResponseUtils.fail("Không tìm thấy ảnh"));
    }

    @DeleteMapping("/{imageId}")
    public Map<String, Object> deleteImage(@PathVariable Integer carId, @PathVariable Integer imageId) {
        return imageRepo.findById(imageId).filter(x -> x.getCarId().equals(carId)).map(image -> {
            imageRepo.delete(image);
            return ResponseUtils.ok("Đã xóa ảnh");
        }).orElse(ResponseUtils.fail("Không tìm thấy ảnh"));
    }
}
