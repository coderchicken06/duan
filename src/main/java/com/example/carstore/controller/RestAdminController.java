package com.example.carstore.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.carstore.entity.Account;
import com.example.carstore.entity.Brand;
import com.example.carstore.entity.Car;
import com.example.carstore.entity.Orders;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.BrandRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.service.OrderService;
import com.example.carstore.service.CarImageService;
import com.example.carstore.util.ImagePathUtils;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestAdminController {

    private final AccountRepository accountRepo;
    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final CarRepository carRepo;
    private final BrandRepository brandRepo;
    private final PasswordEncoder passwordEncoder;
    private final OrderService orderService;
    private final CarImageService carImageService;

    public RestAdminController(AccountRepository accountRepo,
                               OrderRepository orderRepo,
                               OrderDetailRepository detailRepo,
                               CarRepository carRepo,
                               BrandRepository brandRepo,
                               PasswordEncoder passwordEncoder,
                               OrderService orderService,
                               CarImageService carImageService) {
        this.accountRepo = accountRepo;
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.carRepo = carRepo;
        this.brandRepo = brandRepo;
        this.passwordEncoder = passwordEncoder;
        this.orderService = orderService;
        this.carImageService = carImageService;
    }

    // ===== USERS MANAGEMENT =====

    @GetMapping("/users")
    public List<Account> getUsers() {
        return accountRepo.findAll();
    }

    @PostMapping("/users")
    public Map<String, Object> createUser(@RequestBody Account account) {
        try {
            if (account.getUsername() == null || account.getUsername().trim().isEmpty()) {
                return Map.of("success", false, "message", "Username is required");
            }

            if (accountRepo.existsById(account.getUsername())) {
                return Map.of("success", false, "message", "Username already exists");
            }

            if (account.getPassword() == null || account.getPassword().trim().isEmpty()) {
                return Map.of("success", false, "message", "Password is required");
            }

            if (account.getRole() == null || account.getRole().trim().isEmpty()) {
                account.setRole("ROLE_USER");
            }

            if (account.getFullname() == null || account.getFullname().trim().isEmpty()) {
                account.setFullname(account.getUsername());
            }

            account.setPassword(passwordEncoder.encode(account.getPassword()));

            accountRepo.save(account);

            return Map.of("success", true, "message", "User created successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error creating user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{username}")
    public Map<String, Object> updateUser(
            @PathVariable String username,
            @RequestBody Account account) {

        try {
            java.util.Optional<Account> existingOpt = accountRepo.findById(username);
            if (existingOpt.isEmpty()) {
                return Map.of("success", false, "message", "User not found");
            }
            Account existing = existingOpt.get();

            if (account.getFullname() != null) {
                existing.setFullname(account.getFullname());
            }

            if (account.getEmail() != null) {
                existing.setEmail(account.getEmail());
            }

            if (account.getRole() != null) {
                existing.setRole(account.getRole());
            }

            if (account.getPassword() != null && !account.getPassword().trim().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(account.getPassword()));
            }

            accountRepo.save(existing);

            return Map.of("success", true, "message", "User updated successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error updating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{username}")
    public Map<String, Object> deleteUser(@PathVariable String username) {
        try {
            if (!accountRepo.existsById(username)) {
                return Map.of("success", false, "message", "User not found");
            }

            if (orderRepo.existsByUsername(username)) {
                return Map.of(
                        "success", false,
                        "message", "Cannot delete this user because the user already has orders. Keep the user to preserve order history.");
            }

            accountRepo.deleteById(username);

            return Map.of("success", true, "message", "User deleted successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error deleting user: " + e.getMessage());
        }
    }

    // ===== ORDERS MANAGEMENT =====

    @GetMapping("/orders")
    public List<Orders> getOrders() {
        return orderRepo.findAll();
    }

        @PutMapping("/orders/{id}/status")
        public Map<String, Object> updateOrderStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> payload) {

        try {
            String status = payload == null ? null : payload.get("status");
            if (status == null) return Map.of("success", false, "message", "Status is required");
            orderService.updateStatus(id, status.trim());
            return Map.of("success", true, "message", "Order status updated successfully");
        } catch (IllegalArgumentException e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    @DeleteMapping("/orders/{id}")
    public Map<String, Object> deleteOrder(@PathVariable int id) {
        try {
            if (!orderRepo.existsById(id)) {
                return Map.of("success", false, "message", "Order not found");
            }

            orderService.deleteOrder(id);

            return Map.of("success", true, "message", "Order deleted successfully");
        } catch (IllegalArgumentException e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    // ===== CARS MANAGEMENT =====

    @GetMapping("/cars")
    public List<Car> getCars() {
        return carRepo.findAll();
    }

    @PostMapping("/cars")
    public Map<String, Object> createCar(@RequestBody Car car) {
        try {
            String validation = validateCar(car);
            if (validation != null) {
                return Map.of("success", false, "message", validation);
            }
            car.setImage(ImagePathUtils.normalizeForStorage(car.getImage()));
            Car saved = carRepo.save(car);
            carImageService.synchronizeCarImage(saved.getId());

            return Map.of(
                    "success", true,
                    "message", "Car created successfully",
                    "data", saved);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error creating car: " + e.getMessage());
        }
    }

        @PutMapping("/cars/{id}")
        public Map<String, Object> updateCar(
            @PathVariable int id,
            @RequestBody Car car) {

        try {
            java.util.Optional<Car> existingOpt = carRepo.findById(id);
            if (existingOpt.isEmpty()) return Map.of("success", false, "message", "Car not found");
            Car existing = existingOpt.get();

            if (car.getName() == null || car.getName().trim().isEmpty()) {
                return Map.of("success", false, "message", "Car name is required");
            }
            if (car.getPrice() == null || car.getPrice() <= 0) {
                return Map.of("success", false, "message", "Invalid car price");
            }
            if (car.getBrandId() == null) {
                return Map.of("success", false, "message", "Brand is required");
            }
            if (!brandRepo.existsById(car.getBrandId())) {
                return Map.of("success", false, "message", "Brand does not exist");
            }
            if (car.getStock() != null && car.getStock() < 0) {
                return Map.of("success", false, "message", "Stock cannot be negative");
            }

            existing.setName(car.getName());
            existing.setPrice(car.getPrice());
            existing.setImage(ImagePathUtils.normalizeForStorage(car.getImage()));
            existing.setDescription(car.getDescription());
            existing.setBrandId(car.getBrandId());
            existing.setYear(car.getYear());
            existing.setColor(car.getColor());
            existing.setStock(car.getStock());
            existing.setFirstRegistration(car.getFirstRegistration());
            existing.setMileage(car.getMileage());
            existing.setEngineType(car.getEngineType());
            existing.setEngineCapacity(car.getEngineCapacity());
            existing.setInteriorColor(car.getInteriorColor());
            existing.setBodyType(car.getBodyType());
            existing.setSeats(car.getSeats());
            existing.setDrivetrain(car.getDrivetrain());
            existing.setTransmission(car.getTransmission());
            existing.setHorsepower(car.getHorsepower());
            existing.setTorque(car.getTorque());
            existing.setFuelType(car.getFuelType());
            existing.setFuelConsumption(car.getFuelConsumption());
            existing.setWarranty(car.getWarranty());
            existing.setDealerName(car.getDealerName());
            existing.setDealerAddress(car.getDealerAddress());
            existing.setInspectionLevel(car.getInspectionLevel());
            existing.setInspectionNote(car.getInspectionNote());
            existing.setSafetyFeatures(car.getSafetyFeatures());
            existing.setComfortFeatures(car.getComfortFeatures());

            Car updated = carRepo.save(existing);
            carImageService.synchronizeCarImage(updated.getId());

            return Map.of(
                    "success", true,
                    "message", "Car updated successfully",
                    "data", updated);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error updating car: " + e.getMessage());
        }
    }

    @DeleteMapping("/cars/{id}")
    public Map<String, Object> deleteCar(@PathVariable int id) {
        try {
            if (!carRepo.existsById(id)) {
                return Map.of("success", false, "message", "Car not found");
            }

            if (detailRepo.existsByCar_Id(id)) {
                return Map.of(
                        "success", false,
                        "message", "Cannot delete this car because it already appears in order details. Keep it to preserve order history.");
            }

            carRepo.deleteById(id);

            return Map.of("success", true, "message", "Car deleted successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error deleting car: " + e.getMessage());
        }
    }

    // ===== BRANDS MANAGEMENT =====

    @GetMapping("/brands")
    public List<Brand> getBrands() {
        return brandRepo.findAll();
    }

    @PostMapping("/brands")
    public Map<String, Object> createBrand(@RequestBody Brand brand) {
        try {
            Brand saved = brandRepo.save(brand);

            return Map.of(
                    "success", true,
                    "message", "Brand created successfully",
                    "data", saved);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error creating brand: " + e.getMessage());
        }
    }

        @PutMapping("/brands/{id}")
        public Map<String, Object> updateBrand(
            @PathVariable int id,
            @RequestBody Brand brand) {

        try {
            java.util.Optional<Brand> existingOpt = brandRepo.findById(id);
            if (existingOpt.isEmpty()) return Map.of("success", false, "message", "Brand not found");
            Brand existing = existingOpt.get();

            if (brand.getName() != null) {
                existing.setName(brand.getName());
            }

            Brand updated = brandRepo.save(existing);

            return Map.of(
                    "success", true,
                    "message", "Brand updated successfully",
                    "data", updated);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error updating brand: " + e.getMessage());
        }
    }

    @DeleteMapping("/brands/{id}")
    public Map<String, Object> deleteBrand(@PathVariable int id) {
        try {
            if (!brandRepo.existsById(id)) {
                return Map.of("success", false, "message", "Brand not found");
            }

            if (carRepo.countByBrandId(id) > 0) {
                return Map.of(
                        "success", false,
                        "message", "Cannot delete this brand because it is being used by cars. Delete or move those cars first.");
            }

            brandRepo.deleteById(id);

            return Map.of("success", true, "message", "Brand deleted successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error deleting brand: " + e.getMessage());
        }
    }

    // ===== DASHBOARD STATS =====

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        try {
            long totalCars = carRepo.count();
            long totalUsers = accountRepo.count();
            long totalOrders = orderRepo.count();
            long totalBrands = brandRepo.count();

            Double revenue = detailRepo.getRevenue();

            if (revenue == null) {
                revenue = 0.0;
            }

            return Map.of(
                    "success", true,
                    "totalCars", totalCars,
                    "totalUsers", totalUsers,
                    "totalOrders", totalOrders,
                    "totalBrands", totalBrands,
                    "revenue", revenue);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error fetching stats: " + e.getMessage());
        }
    }

    @GetMapping("/revenue")
    public Map<String, Object> getRevenue() {
        try {
            Double revenue = detailRepo.getRevenue();

            if (revenue == null) {
                revenue = 0.0;
            }

            return Map.of(
                    "success", true,
                    "revenue", revenue);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error fetching revenue: " + e.getMessage());
        }
    }

    @GetMapping("/top-cars")
    public Map<String, Object> getTopCars() {
        try {
            List<Object[]> topCars = detailRepo.topCars();

            return Map.of(
                    "success", true,
                    "data", topCars);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error fetching top cars: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard-info")
    public Map<String, Object> getDashboardInfo() {
        try {
            long adminCount = accountRepo.countByRole("ROLE_ADMIN");
            long userCount = accountRepo.countByRole("ROLE_USER");

            Double revenue = detailRepo.getRevenue();

            if (revenue == null) {
                revenue = 0.0;
            }

            Map<String, Object> stats = Map.of(
                    "totalCars", carRepo.count(),
                    "totalUsers", accountRepo.count(),
                    "totalOrders", orderRepo.count(),
                    "totalBrands", brandRepo.count(),
                    "revenue", revenue);

            Map<String, Object> users = Map.of(
                    "count", accountRepo.count(),
                    "admins", adminCount,
                    "users", userCount);

            return Map.of(
                    "success", true,
                    "stats", stats,
                    "users", users,
                    "topCars", detailRepo.topCars());

        } catch (Exception e) {
            return Map.of("success", false, "message", "Error fetching dashboard info: " + e.getMessage());
        }
    }

    private String validateCar(Car car) {
        if (car == null || car.getName() == null || car.getName().trim().isEmpty()) {
            return "Car name is required";
        }
        if (car.getPrice() == null || car.getPrice() <= 0) {
            return "Invalid car price";
        }
        if (car.getBrandId() == null || !brandRepo.existsById(car.getBrandId())) {
            return "Brand is required or does not exist";
        }
        if (car.getStock() != null && car.getStock() < 0) {
            return "Stock cannot be negative";
        }
        return null;
    }
}
