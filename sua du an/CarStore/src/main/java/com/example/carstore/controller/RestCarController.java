package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.util.ResponseUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
            return carRepo.findByNameContainingIgnoreCase(q.trim());
        }
        return carRepo.findAll();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getCarById(@PathVariable int id) {
        return carRepo.findById(id)
                .map(car -> Map.<String, Object>of("success", true, "data", car))
                .orElse(ResponseUtils.fail("Car not found"));
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
        List<Car> cars = carRepo.findByNameContainingIgnoreCase(keyword);
        return Map.of("success", true, "data", cars, "count", cars.size());
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Car car) {
        String validation = validateCar(car);
        if (validation != null) {
            return ResponseUtils.fail(validation);
        }
        return ResponseUtils.ok("Car created successfully", "data", carRepo.save(car));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable int id, @RequestBody Car car) {
        return carRepo.findById(id).map(existing -> {
            copyCarFields(car, existing);
            return ResponseUtils.ok("Car updated successfully", "data", carRepo.save(existing));
        }).orElse(ResponseUtils.fail("Car not found"));
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable int id) {
        if (!carRepo.existsById(id)) {
            return ResponseUtils.fail("Car not found");
        }
        carRepo.deleteById(id);
        return ResponseUtils.ok("Car deleted successfully");
    }

    @GetMapping("/stats/count")
    public Map<String, Object> getCarsCount() {
        return Map.of("success", true, "count", carRepo.count());
    }

    private String validateCar(Car car) {
        if (car == null || car.getName() == null || car.getName().trim().isEmpty()) {
            return "Car name is required";
        }
        if (car.getPrice() == null || car.getPrice() <= 0) {
            return "Invalid car price";
        }
        return null;
    }

    private void copyCarFields(Car source, Car target) {
        if (source.getName() != null) target.setName(source.getName());
        if (source.getPrice() != null) target.setPrice(source.getPrice());
        if (source.getImage() != null) target.setImage(source.getImage());
        if (source.getDescription() != null) target.setDescription(source.getDescription());
        if (source.getBrandId() != null) target.setBrandId(source.getBrandId());
        if (source.getYear() != null) target.setYear(source.getYear());
        if (source.getColor() != null) target.setColor(source.getColor());
        if (source.getStock() != null) target.setStock(source.getStock());
        if (source.getFirstRegistration() != null) target.setFirstRegistration(source.getFirstRegistration());
        if (source.getMileage() != null) target.setMileage(source.getMileage());
        if (source.getEngineType() != null) target.setEngineType(source.getEngineType());
        if (source.getEngineCapacity() != null) target.setEngineCapacity(source.getEngineCapacity());
        if (source.getInteriorColor() != null) target.setInteriorColor(source.getInteriorColor());
        if (source.getBodyType() != null) target.setBodyType(source.getBodyType());
        if (source.getSeats() != null) target.setSeats(source.getSeats());
        if (source.getDrivetrain() != null) target.setDrivetrain(source.getDrivetrain());
        if (source.getTransmission() != null) target.setTransmission(source.getTransmission());

        if (source.getHorsepower() != null) target.setHorsepower(source.getHorsepower());
        if (source.getTorque() != null) target.setTorque(source.getTorque());
        if (source.getFuelType() != null) target.setFuelType(source.getFuelType());
        if (source.getFuelConsumption() != null) target.setFuelConsumption(source.getFuelConsumption());
        if (source.getWarranty() != null) target.setWarranty(source.getWarranty());
        if (source.getDealerName() != null) target.setDealerName(source.getDealerName());
        if (source.getDealerAddress() != null) target.setDealerAddress(source.getDealerAddress());
        if (source.getInspectionLevel() != null) target.setInspectionLevel(source.getInspectionLevel());
        if (source.getInspectionNote() != null) target.setInspectionNote(source.getInspectionNote());
        if (source.getSafetyFeatures() != null) target.setSafetyFeatures(source.getSafetyFeatures());
        if (source.getComfortFeatures() != null) target.setComfortFeatures(source.getComfortFeatures());
    }
}