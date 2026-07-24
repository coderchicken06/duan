package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.util.ResponseUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestCarController {

    private final CarRepository carRepo;

    public RestCarController(CarRepository carRepo) {
        this.carRepo = carRepo;
    }

    @GetMapping
    public List<Car> getAll(@RequestParam(required = false) String q) {
        if (q != null && !q.trim().isEmpty()) {
            String query = q.trim();
            return carRepo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
        }
        return carRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCarById(@PathVariable int id) {
        return carRepo.findById(id)
                .map(car -> ResponseEntity.ok(Map.<String, Object>of("success", true, "data", car)))
                .orElseGet(() -> ResponseEntity.status(404).body(ResponseUtils.fail("Car not found")));
    }


    @GetMapping("/{id}/similar")
    public List<Car> getSimilar(@PathVariable int id) {
        return carRepo.findById(id).map(car -> {
            List<Car> similar = car.getBodyType() == null ? List.of()
                    : carRepo.findTop6ByBodyTypeAndIdNotOrderByPriceAsc(car.getBodyType(), id);
            if (similar.isEmpty() && car.getBrandId() != null) {
                similar = carRepo.findTop6ByBrandIdAndIdNotOrderByPriceAsc(car.getBrandId(), id);
            }
            return similar;
        }).orElse(List.of());
    }

    @GetMapping("/search")
    public Map<String, Object> searchCars(@RequestParam String keyword) {
        String query = keyword == null ? "" : keyword.trim();
        List<Car> cars = query.isEmpty() ? carRepo.findAll()
                : carRepo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
        return Map.of("success", true, "data", cars, "count", cars.size());
    }

    @GetMapping("/stats/count")
    public Map<String, Object> getCarsCount() {
        return Map.of("success", true, "count", carRepo.count());
    }

}
