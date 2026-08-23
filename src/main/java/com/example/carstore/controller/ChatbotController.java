package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.repository.BrandRepository;
import com.example.carstore.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChatbotController {
    private static final List<String> INITIAL_SUGGESTIONS = List.of(
            "Tư vấn theo tầm giá", "Tư vấn theo nhu cầu sử dụng", "Xe 5 chỗ gia đình",
            "Xe 7 chỗ rộng rãi", "Xem xe mới nhất");
    private static final List<String> FINISH_SUGGESTIONS = List.of(
            "Xem thêm xe khác", "Tư vấn lại từ đầu", "Liên hệ nhân viên");

    private final CarRepository carRepository;
    private final BrandRepository brandRepository;

    public ChatbotController(CarRepository carRepository) {
        this(carRepository, null);
    }

    @Autowired
    public ChatbotController(CarRepository carRepository, BrandRepository brandRepository) {
        this.carRepository = carRepository;
        this.brandRepository = brandRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> processMessage(
            @RequestBody(required = false) Map<String, String> payload) {
        String message = payload == null ? "" : payload.getOrDefault("message", "");
        String text = message.trim();
        String normalized = text.toLowerCase(java.util.Locale.ROOT);
        List<Car> cars = new ArrayList<>();
        List<String> suggestions;
        String reply;

        if (text.isEmpty() || isGreeting(normalized)) {
            reply = "Xin chào! CarStore có thể tư vấn xe theo tầm giá hoặc nhu cầu sử dụng của bạn.";
            suggestions = INITIAL_SUGGESTIONS;
        } else if (normalized.contains("tầm giá") || normalized.contains("giá")) {
            reply = "Anh/chị dự kiến ngân sách ở khoảng nào?";
            suggestions = List.of("Dưới 600 triệu", "600 - 900 triệu", "900 triệu - 1.5 tỷ", "Trên 1.5 tỷ");
        } else if (normalized.contains("nhu cầu")) {
            reply = "CarStore sẽ chọn xe phù hợp với cách sử dụng của anh/chị.";
            suggestions = List.of("Đi lại đô thị tiết kiệm xăng", "Chở gia đình & du lịch",
                    "Xe gầm cao offroad / bán tải", "Xe sang trọng lịch lãm");
        } else if (isPriceRange(normalized)) {
            cars = findByPriceRange(normalized);
            reply = cars.isEmpty() ? "Hiện chưa có xe phù hợp trong tầm giá này."
                    : "Đây là các mẫu xe đang có sẵn phù hợp với tầm giá của anh/chị.";
            suggestions = FINISH_SUGGESTIONS;
        } else if (isNeed(normalized)) {
            cars = findByNeed(normalized);
            reply = cars.isEmpty() ? "Hiện chưa có mẫu xe phù hợp nhu cầu này trong kho."
                    : "Đây là các mẫu xe CarStore gợi ý theo nhu cầu sử dụng của anh/chị.";
            suggestions = FINISH_SUGGESTIONS;
        } else if (normalized.contains("xem xe mới nhất") || normalized.contains("xem thêm xe khác")) {
            cars = availableCars().stream().limit(4).collect(Collectors.toList());
            reply = "Đây là các mẫu xe đang có sẵn tại CarStore.";
            suggestions = FINISH_SUGGESTIONS;
        } else if (normalized.contains("tư vấn lại từ đầu")) {
            reply = "Mình bắt đầu lại nhé. Anh/chị muốn chọn xe theo tiêu chí nào?";
            suggestions = INITIAL_SUGGESTIONS;
        } else if (normalized.contains("liên hệ nhân viên") || normalized.contains("hotline")) {
            reply = "Anh/chị có thể liên hệ CarStore qua hotline 0909.123.456 để được hỗ trợ trực tiếp.";
            suggestions = INITIAL_SUGGESTIONS;
        } else {
            String keyword = extractKeyword(text);
            cars = carRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword).stream()
                    .filter(this::isAvailable).limit(6).collect(Collectors.toList());
            reply = cars.isEmpty()
                    ? "CarStore chưa có mẫu xe '" + keyword + "'. Đây là một số xe đang có sẵn để anh/chị tham khảo."
                    : "CarStore tìm thấy các mẫu xe phù hợp với '" + keyword + "'.";
            if (cars.isEmpty()) cars = availableCars().stream().limit(4).collect(Collectors.toList());
            suggestions = FINISH_SUGGESTIONS;
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("reply", reply);
        response.put("suggestions", suggestions);
        response.put("recommendedCars", toCards(cars));
        response.put("cars", cars);
        return ResponseEntity.ok(response);
    }

    private boolean isGreeting(String text) {
        return text.equals("bắt đầu") || text.equals("tư vấn") || text.contains("xin chào")
                || text.equals("chào") || text.equals("hi") || text.equals("hello");
    }

    private boolean isPriceRange(String text) {
        return text.contains("dưới 600") || text.contains("600 - 900")
                || text.contains("900 triệu - 1.5") || text.contains("trên 1.5");
    }

    private boolean isNeed(String text) {
        return text.contains("đô thị") || text.contains("gia đình") || text.contains("offroad")
                || text.contains("bán tải") || text.contains("sang trọng");
    }

    private List<Car> findByPriceRange(String text) {
        return availableCars().stream().filter(car -> {
            double price = car.getPrice() == null ? 0D : car.getPrice();
            if (text.contains("dưới 600")) return price < 600_000_000D;
            if (text.contains("600 - 900")) return price >= 600_000_000D && price <= 900_000_000D;
            if (text.contains("900 triệu - 1.5")) return price >= 900_000_000D && price <= 1_500_000_000D;
            return price > 1_500_000_000D;
        }).limit(6).collect(Collectors.toList());
    }

    private List<Car> findByNeed(String text) {
        return availableCars().stream().filter(car -> {
            String searchable = (safe(car.getBodyType()) + " " + safe(car.getDescription()) + " "
                    + safe(car.getFuelType()) + " " + safe(car.getName())).toLowerCase(java.util.Locale.ROOT);
            if (text.contains("đô thị")) return car.getSeats() != null && car.getSeats() <= 5;
            if (text.contains("gia đình")) return car.getSeats() != null && car.getSeats() >= 5;
            if (text.contains("offroad") || text.contains("bán tải")) {
                return searchable.contains("suv") || searchable.contains("pickup") || searchable.contains("bán tải");
            }
            return searchable.contains("luxury") || searchable.contains("sang")
                    || car.getPrice() != null && car.getPrice() >= 1_500_000_000D;
        }).limit(6).collect(Collectors.toList());
    }

    private List<Car> availableCars() {
        return carRepository.findAll().stream().filter(this::isAvailable).collect(Collectors.toList());
    }

    private List<Map<String, Object>> toCards(List<Car> cars) {
        Map<Integer, String> brands = brandRepository == null ? Collections.emptyMap()
                : brandRepository.findAll().stream()
                        .collect(Collectors.toMap(brand -> brand.getId(), brand -> brand.getName()));
        return cars.stream().map(car -> {
            Map<String, Object> card = new LinkedHashMap<>();
            card.put("id", car.getId());
            card.put("carName", car.getName());
            card.put("price", car.getPrice());
            card.put("mainImageUrl", car.getImageUrl());
            card.put("brandName", brands.getOrDefault(car.getBrandId(), "Chưa xác định"));
            return card;
        }).collect(Collectors.toList());
    }

    private String extractKeyword(String message) {
        String result = message.replaceAll("(?i)\\b(tìm|kiếm|xe|cho tôi|xem)\\b", "").trim();
        return result.isEmpty() ? message : result;
    }

    private boolean isAvailable(Car car) {
        return car != null && "AVAILABLE".equalsIgnoreCase(car.getStatus());
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
