package com.example.carstore.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.carstore.entity.Account;
import com.example.carstore.dto.AccountDto;
import com.example.carstore.entity.Brand;
import com.example.carstore.entity.Car;
import com.example.carstore.dto.OrderResponseDto;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.BrandRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.ReviewRepository;
import com.example.carstore.repository.QuotationRepository;
import com.example.carstore.repository.QuotationItemRepository;
import com.example.carstore.repository.PromotionCarRepository;
import com.example.carstore.repository.SupportRequestRepository;
import com.example.carstore.repository.ContractRepository;
import com.example.carstore.repository.NewsRepository;
import com.example.carstore.service.OrderService;
import com.example.carstore.service.CarImageService;
import com.example.carstore.util.ImagePathUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
    private final ReviewRepository reviewRepo;
    private final QuotationRepository quotationRepo;
    private final QuotationItemRepository quotationItemRepo;
    private final PromotionCarRepository promotionCarRepo;
    private final SupportRequestRepository supportRequestRepo;
    private final ContractRepository contractRepo;
    private final NewsRepository newsRepo;

    public RestAdminController(AccountRepository accountRepo,
                               OrderRepository orderRepo,
                               OrderDetailRepository detailRepo,
                               CarRepository carRepo,
                               BrandRepository brandRepo,
                               PasswordEncoder passwordEncoder,
                               OrderService orderService,
                               CarImageService carImageService,
                               ReviewRepository reviewRepo,
                               QuotationRepository quotationRepo,
                               QuotationItemRepository quotationItemRepo,
                               PromotionCarRepository promotionCarRepo,
                               SupportRequestRepository supportRequestRepo,
                               ContractRepository contractRepo,
                               NewsRepository newsRepo) {
        this.accountRepo = accountRepo;
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.carRepo = carRepo;
        this.brandRepo = brandRepo;
        this.passwordEncoder = passwordEncoder;
        this.orderService = orderService;
        this.carImageService = carImageService;
        this.reviewRepo = reviewRepo;
        this.quotationRepo = quotationRepo;
        this.quotationItemRepo = quotationItemRepo;
        this.promotionCarRepo = promotionCarRepo;
        this.supportRequestRepo = supportRequestRepo;
        this.contractRepo = contractRepo;
        this.newsRepo = newsRepo;
    }

    // ===== USERS MANAGEMENT =====

    @GetMapping("/users")
    public List<AccountDto> getUsers() {
        return accountRepo.findAll().stream()
                .map(AccountDto::from)
                .collect(java.util.stream.Collectors.toList());
    }

    @PostMapping("/users")
    public Map<String, Object> createUser(@RequestBody Account account) {
        try {
            if (account.getUsername() == null || account.getUsername().trim().isEmpty()) {
                throw badRequest("Tên đăng nhập là bắt buộc.");
            }

            if (accountRepo.existsById(account.getUsername())) {
                throw badRequest("Tên đăng nhập đã tồn tại.");
            }

            if (account.getPassword() == null || account.getPassword().trim().isEmpty()) {
                throw badRequest("Mật khẩu là bắt buộc.");
            }

            if (account.getRole() == null || account.getRole().trim().isEmpty()) {
                account.setRole("ROLE_USER");
            }
            if (!List.of("ROLE_USER", "ROLE_ADMIN").contains(account.getRole())) {
                throw badRequest("Vai trò phải là ROLE_USER hoặc ROLE_ADMIN.");
            }
            account.setEnabled(true);
            account.setVerificationCode(null);
            account.setVerificationExpired(null);

            if (account.getFullname() == null || account.getFullname().trim().isEmpty()) {
                account.setFullname(account.getUsername());
            }

            account.setPassword(passwordEncoder.encode(account.getPassword()));

            accountRepo.save(account);

            return Map.of("success", true, "message", "User created successfully");
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể tạo tài khoản.", e);
        }
    }

    @PutMapping("/users/{username}")
    public Map<String, Object> updateUser(
            @PathVariable String username,
            @RequestBody Account account,
            Authentication authentication) {

        try {
            java.util.Optional<Account> existingOpt = accountRepo.findById(username);
            if (existingOpt.isEmpty()) {
                throw notFound("Không tìm thấy tài khoản.");
            }
            Account existing = existingOpt.get();
            String previousRole = existing.getRole();

            if (account.getFullname() != null) {
                existing.setFullname(account.getFullname());
            }

            if (account.getEmail() != null) {
                existing.setEmail(account.getEmail());
            }

            if (account.getRole() != null) {
                if (!List.of("ROLE_USER", "ROLE_ADMIN").contains(account.getRole())) {
                    throw badRequest("Vai trò phải là ROLE_USER hoặc ROLE_ADMIN.");
                }
                if ("ROLE_ADMIN".equals(existing.getRole())
                        && !"ROLE_ADMIN".equals(account.getRole())
                        && accountRepo.countByRole("ROLE_ADMIN") <= 1) {
                    throw badRequest("Không thể hạ quyền quản trị viên cuối cùng.");
                }
                existing.setRole(account.getRole());
            }

            if (account.getPassword() != null && !account.getPassword().trim().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(account.getPassword()));
            }

            accountRepo.save(existing);

            boolean roleChanged = !Objects.equals(previousRole, existing.getRole());
            boolean currentUser = authentication != null && username.equals(authentication.getName());
            boolean sessionUpdated = roleChanged && currentUser;
            boolean requiresRelogin = roleChanged && !currentUser;

            if (sessionUpdated) {
                refreshAuthentication(authentication, existing.getRole());
            }

            String message = requiresRelogin
                    ? "Đã cập nhật quyền. Người dùng này cần đăng nhập lại để nhận quyền mới."
                    : "User updated successfully";

            return Map.of(
                    "success", true,
                    "message", message,
                    "roleChanged", roleChanged,
                    "sessionUpdated", sessionUpdated,
                    "requiresRelogin", requiresRelogin);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể cập nhật tài khoản.", e);
        }
    }

    @DeleteMapping("/users/{username}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String username, Authentication authentication) {
        try {
            java.util.Optional<Account> accountOpt = accountRepo.findById(username);
            if (accountOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Không tìm thấy tài khoản."));
            }
            if (authentication != null && username.equals(authentication.getName())) {
                return invalidDelete("Không thể xóa tài khoản đang đăng nhập.");
            }
            if ("ROLE_ADMIN".equals(accountOpt.get().getRole())
                    && accountRepo.countByRole("ROLE_ADMIN") <= 1) {
                return invalidDelete("Không thể xóa tài khoản quản trị viên cuối cùng.");
            }

            if (hasLinkedUserData(username)) {
                return invalidDelete(
                        "Tài khoản đã có đơn hàng, báo giá, đánh giá, yêu cầu hỗ trợ, hợp đồng hoặc tin tức liên kết; không thể xóa để bảo toàn lịch sử dữ liệu.");
            }

            accountRepo.deleteById(username);

            return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa tài khoản thành công."));
        } catch (Exception e) {
            return invalidDelete("Không thể xóa tài khoản vì dữ liệu còn liên kết. Vui lòng kiểm tra lịch sử giao dịch.");
        }
    }

    // ===== ORDERS MANAGEMENT =====

    @GetMapping("/orders")
    public Object getOrders(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null && size == null) {
            return getOrders();
        }
        validatePagination(page, size);
        Page<com.example.carstore.entity.Orders> result = orderRepo.findAll(PageRequest.of(page, size));
        List<OrderResponseDto> data = orderService.toOrderResponses(result.getContent());
        return Map.of(
                "success", true,
                "data", data,
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalPages", result.getTotalPages(),
                "totalElements", result.getTotalElements());
    }

    // Giữ nguyên kiểu phản hồi danh sách cũ khi client không truyền page/size.
    public List<OrderResponseDto> getOrders() {
        return orderService.toOrderResponses(orderRepo.findAll());
    }

    // ===== CONTRACTS MANAGEMENT =====

    @GetMapping("/contracts")
    public Object getContracts(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null && size == null) {
            return contractRepo.findAll();
        }
        validatePagination(page, size);
        Page<com.example.carstore.entity.Contract> result = contractRepo.findAll(PageRequest.of(page, size));
        return Map.of(
                "success", true,
                "data", result.getContent(),
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalPages", result.getTotalPages(),
                "totalElements", result.getTotalElements());
    }

    // ===== SUPPORT REQUESTS MANAGEMENT =====

    @GetMapping({"/support-requests", "/support"})
    public Object getSupportRequests(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null && size == null) {
            return supportRequestRepo.findAll();
        }
        validatePagination(page, size);
        Page<com.example.carstore.entity.SupportRequest> result = supportRequestRepo.findAll(PageRequest.of(page, size));
        return Map.of(
                "success", true,
                "data", result.getContent(),
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalPages", result.getTotalPages(),
                "totalElements", result.getTotalElements());
    }

        @PutMapping("/orders/{id}/status")
        public Map<String, Object> updateOrderStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> payload) {

        try {
            String status = payload == null ? null : payload.get("status");
            if (status == null || status.trim().isEmpty()) {
                throw badRequest("Trạng thái đơn hàng là bắt buộc.");
            }
            orderService.updateStatus(id, status.trim());
            return Map.of("success", true, "message", "Order status updated successfully");
        } catch (IllegalArgumentException e) {
            throw badRequest(e.getMessage());
        }
    }

    // ===== CARS MANAGEMENT =====

    @GetMapping("/cars")
    public List<Car> getCars() {
        return carRepo.findAll();
    }

    @GetMapping("/cars/{id}")
    public ResponseEntity<Map<String, Object>> getCarByIdForAdmin(@PathVariable int id) {
        return carRepo.findById(id)
                .map(car -> ResponseEntity.ok(Map.<String, Object>of("success", true, "data", car)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Không tìm thấy xe.")));
    }

    @PostMapping("/cars")
    public Map<String, Object> createCar(@RequestBody Car car) {
        try {
            String validation = validateCar(car);
            if (validation != null) {
                throw badRequest(validation);
            }
            car.setImage(ImagePathUtils.normalizeForStorage(car.getImage()));
            synchronizeStatusWithStock(car);
            Car saved = carRepo.save(car);
            carImageService.synchronizeCarImage(saved.getId());

            return Map.of(
                    "success", true,
                    "message", "Car created successfully",
                    "data", saved);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Không thể tạo xe.";
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, msg, e);
        }
    }

    @PutMapping("/cars/{id}")
    public Map<String, Object> updateCar(
            @PathVariable int id,
            @RequestBody Car car) {

        try {
            java.util.Optional<Car> existingOpt = carRepo.findById(id);
            if (existingOpt.isEmpty()) {
                throw notFound("Không tìm thấy xe.");
            }
            Car existing = existingOpt.get();

            if (car.getName() == null || car.getName().trim().isEmpty()) {
                throw badRequest("Tên xe là bắt buộc.");
            }
            if (car.getPrice() == null || car.getPrice() <= 0) {
                throw badRequest("Giá xe không hợp lệ.");
            }
            if (car.getBrandId() == null) {
                throw badRequest("Thương hiệu là bắt buộc.");
            }
            if (!brandRepo.existsById(car.getBrandId())) {
                throw badRequest("Thương hiệu không tồn tại.");
            }
            if (car.getStock() != null && car.getStock() < 0) {
                throw badRequest("Tồn kho không được âm.");
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
            synchronizeStatusWithStock(existing);

            Car updated = carRepo.save(existing);
            carImageService.synchronizeCarImage(updated.getId());

            return Map.of(
                    "success", true,
                    "message", "Car updated successfully",
                    "data", updated);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Không thể cập nhật xe.";
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, msg, e);
        }
    }

    @DeleteMapping("/cars/{id}")
    public ResponseEntity<Map<String, Object>> deleteCar(@PathVariable int id) {
        try {
            if (!carRepo.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Không tìm thấy xe."));
            }

            if (hasLinkedCarData(id)) {
                return invalidDelete(
                        "Xe đã có lịch sử giao dịch, báo giá, đánh giá hoặc khuyến mãi; không thể xóa trực tiếp. Vui lòng chuyển trạng thái xe sang INACTIVE.");
            }

            carRepo.deleteById(id);

            return ResponseEntity.ok(Map.of("success", true, "message", "Đã xóa xe thành công."));
        } catch (Exception e) {
            return invalidDelete("Không thể xóa xe vì dữ liệu còn liên kết. Vui lòng chuyển trạng thái xe sang INACTIVE.");
        }
    }

    private boolean hasLinkedUserData(String username) {
        return orderRepo.existsByUsername(username)
                || reviewRepo.existsByUsername(username)
                || quotationRepo.existsByCustomerUsername(username)
                || supportRequestRepo.existsByUsername(username)
                || contractRepo.existsByCustomerUsernameOrEmployeeUsername(username, username)
                || newsRepo.existsByAuthor(username);
    }

    private boolean hasLinkedCarData(int carId) {
        return detailRepo.existsByCar_Id(carId)
                || reviewRepo.existsByCarId(carId)
                || quotationRepo.existsByCarId(carId)
                || quotationItemRepo.existsByCarId(carId)
                || promotionCarRepo.existsByCarId(carId);
    }

    private ResponseEntity<Map<String, Object>> invalidDelete(String message) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", message));
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
            throw badRequest("Không thể tạo thương hiệu: " + e.getMessage());
        }
    }

        @PutMapping("/brands/{id}")
        public Map<String, Object> updateBrand(
            @PathVariable int id,
            @RequestBody Brand brand) {

        try {
            java.util.Optional<Brand> existingOpt = brandRepo.findById(id);
            if (existingOpt.isEmpty()) {
                throw notFound("Không tìm thấy thương hiệu.");
            }
            Brand existing = existingOpt.get();

            if (brand.getName() != null) {
                existing.setName(brand.getName());
            }

            Brand updated = brandRepo.save(existing);

            return Map.of(
                    "success", true,
                    "message", "Brand updated successfully",
                    "data", updated);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw badRequest("Không thể cập nhật thương hiệu: " + e.getMessage());
        }
    }

    @DeleteMapping("/brands/{id}")
    public Map<String, Object> deleteBrand(@PathVariable int id) {
        try {
            if (!brandRepo.existsById(id)) {
                throw notFound("Không tìm thấy thương hiệu.");
            }

            if (carRepo.countByBrandId(id) > 0) {
                throw badRequest("Không thể xóa thương hiệu đang được xe sử dụng.");
            }

            brandRepo.deleteById(id);

            return Map.of("success", true, "message", "Brand deleted successfully");
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw badRequest("Không thể xóa thương hiệu vì dữ liệu còn liên kết.");
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
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể tải thống kê.", e);
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
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể tải doanh thu.", e);
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
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể tải danh sách xe bán chạy.", e);
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
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể tải dữ liệu tổng quan.", e);
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

    private void validatePagination(Integer page, Integer size) {
        if (page == null || size == null || page < 0 || size < 1 || size > 100) {
            throw badRequest("page phải từ 0 và size phải trong khoảng 1 đến 100.");
        }
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }

    private void refreshAuthentication(Authentication authentication, String role) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authentication.getAuthorities().stream()
                .filter(authority -> !authority.getAuthority().startsWith("ROLE_"))
                .forEach(authorities::add);
        authorities.add(new SimpleGrantedAuthority(role));

        Authentication updatedAuthentication;
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth = (OAuth2AuthenticationToken) authentication;
            updatedAuthentication = new OAuth2AuthenticationToken(
                    oauth.getPrincipal(), authorities, oauth.getAuthorizedClientRegistrationId());
        } else {
            UsernamePasswordAuthenticationToken usernamePassword =
                    new UsernamePasswordAuthenticationToken(
                            authentication.getPrincipal(), authentication.getCredentials(), authorities);
            usernamePassword.setDetails(authentication.getDetails());
            updatedAuthentication = usernamePassword;
        }
        SecurityContextHolder.getContext().setAuthentication(updatedAuthentication);
    }

    /**
     * Stock is the source of truth for sellable inventory. Keep explicit INACTIVE
     * untouched, and preserve explicit SOLD/DEPOSITED states while stock remains
     * zero. Replenishing a stock-depleted state makes the car
     * available again.
     */
    private void synchronizeStatusWithStock(Car car) {
        int stock = car.getStock();
        String status = car.getStatus() == null ? "AVAILABLE" : car.getStatus().trim().toUpperCase();

        if ("INACTIVE".equals(status)) {
            car.setStatus(status);
            return;
        }
        if (stock <= 0) {
            if ("AVAILABLE".equals(status)) {
                car.setStatus("OUT_OF_STOCK");
            } else {
                car.setStatus(status);
            }
            return;
        }
        if ("DEPOSITED".equals(status) || "SOLD".equals(status) || "OUT_OF_STOCK".equals(status)) {
            car.setStatus("AVAILABLE");
        } else {
            car.setStatus(status);
        }
    }
}
