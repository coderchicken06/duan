package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.BrandRepository;
import com.example.carstore.util.ResponseUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestCarController {

    private final CarRepository carRepo;
    private final BrandRepository brandRepo;

    public RestCarController(CarRepository carRepo, BrandRepository brandRepo) {
        this.carRepo = carRepo;
        this.brandRepo = brandRepo;
    }

    @GetMapping
    public List<Car> getAll(@RequestParam(required = false) String q) {
        List<Car> cars;
        if (q != null && !q.trim().isEmpty()) {
            String query = q.trim();
            cars = carRepo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
        } else {
            cars = carRepo.findAll();
        }
        return cars.stream().filter(this::isAvailable).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCarById(@PathVariable int id) {
        return carRepo.findById(id)
                .filter(this::isAvailable)
                .map(car -> ResponseEntity.ok(Map.<String, Object>of("success", true, "data", car)))
                .orElseGet(() -> ResponseEntity.status(404).body(ResponseUtils.fail("Car not found")));
    }


    @GetMapping("/{id}/similar")
    public List<Car> getSimilar(@PathVariable int id) {
        return carRepo.findById(id).filter(this::isAvailable).map(car -> {
            List<Car> similar = car.getBodyType() == null ? List.of()
                    : carRepo.findTop6ByBodyTypeAndIdNotOrderByPriceAsc(car.getBodyType(), id);
            if (similar.isEmpty() && car.getBrandId() != null) {
                similar = carRepo.findTop6ByBrandIdAndIdNotOrderByPriceAsc(car.getBrandId(), id);
            }
            return similar.stream().filter(this::isAvailable).collect(Collectors.toList());
        }).orElse(List.of());
    }

    @GetMapping("/search")
    public Map<String, Object> searchCars(@RequestParam String keyword) {
        String query = keyword == null ? "" : keyword.trim();
        List<Car> cars = query.isEmpty() ? carRepo.findAll()
                : carRepo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
        cars = cars.stream().filter(this::isAvailable).collect(Collectors.toList());
        return Map.of("success", true, "data", cars, "count", cars.size());
    }

    @GetMapping("/suggest")
    public Map<String, Object> suggest(@RequestParam String keyword) {
        String query = keyword == null ? "" : keyword.trim();
        if (query.isEmpty()) {
            return Map.of("success", true, "data", List.of());
        }
        Map<Integer, String> brandNames = brandRepo.findAll().stream()
                .collect(Collectors.toMap(b -> b.getId(), b -> b.getName()));
        List<Car> matchedCars = carRepo.findSmartSuggestions(query, PageRequest.of(0, 6));
        if (matchedCars.isEmpty()) {
            String normalizedQuery = query.replaceAll("(?i)\\s*chỗ", "").trim();
            if (!normalizedQuery.isEmpty() && !normalizedQuery.equalsIgnoreCase(query)) {
                matchedCars = carRepo.findSmartSuggestions(normalizedQuery, PageRequest.of(0, 6));
            }
        }
        List<Map<String, Object>> suggestions = matchedCars.stream()
                .map(car -> toSuggestion(car, brandNames))
                .collect(Collectors.toList());
        return Map.of("success", true, "data", suggestions);
    }

    private Map<String, Object> toSuggestion(Car car, Map<Integer, String> brandNames) {
        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("id", car.getId());
        result.put("carName", car.getName());
        result.put("price", car.getPrice());
        result.put("mainImageUrl", car.getImageUrl());
        result.put("brandName", brandNames.getOrDefault(car.getBrandId(), "Chưa xác định"));
        result.put("fuelType", car.getFuelType());
        result.put("seatCapacity", car.getSeats());
        return result;
    }

    @GetMapping("/stats/count")
    public Map<String, Object> getCarsCount() {
        long count = carRepo.findAll().stream().filter(this::isAvailable).count();
        return Map.of("success", true, "count", count);
    }

    private boolean isAvailable(Car car) {
        return car != null && "AVAILABLE".equalsIgnoreCase(car.getStatus());
    }

}
