package com.example.carstore.controller;

import com.example.carstore.entity.Brand;
import com.example.carstore.entity.Car;
import com.example.carstore.repository.BrandRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", allowCredentials = "false")
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);

    private final CarRepository carRepository;
    private final BrandRepository brandRepository;
    private final GeminiService geminiService;

    public ChatbotController(CarRepository carRepository, BrandRepository brandRepository,
            GeminiService geminiService) {
        this.carRepository = carRepository;
        this.brandRepository = brandRepository;
        this.geminiService = geminiService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> processMessage(
            @RequestBody(required = false) Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();

        if (payload == null || !payload.containsKey("message") || payload.get("message") == null) {
            response.put("reply", "Vui lòng nhập nội dung tin nhắn!");
            response.put("cars", Collections.emptyList());
            return ResponseEntity.badRequest().body(response);
        }

        String userText = payload.get("message").trim();
        if (userText.isEmpty()) {
            response.put("reply", "Vui lòng nhập nội dung tin nhắn!");
            response.put("cars", Collections.emptyList());
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // 1. Lấy danh sách xe và danh mục hãng xe từ CSDL
            List<Car> allCars = new ArrayList<>();
            Map<Integer, String> brandMap = new HashMap<>();
            try {
                allCars = carRepository.findAll();
                List<Brand> brands = brandRepository.findAll();
                for (Brand b : brands) {
                    brandMap.put(b.getId(), b.getName());
                }
            } catch (Exception e) {
                logger.error("Lỗi khi truy vấn CSDL CarStore: {}", e.getMessage());
            }

            // 2. Lọc danh sách xe phù hợp chính xác theo điều kiện cứng (Brand, Giá, Kiểu
            // dáng, Màu sắc, Số chỗ)
            List<Car> matchedCars = filterMatchingCars(userText, allCars, brandMap);

            // 3. Thử gọi Gemini AI với ngữ cảnh LÀ DANH SÁCH XE ĐÃ LỌC MATCHED CARS
            List<Car> contextCars = (matchedCars != null && !matchedCars.isEmpty()) ? matchedCars : allCars;
            String aiReply = geminiService.generateReply(userText, contextCars);

            if (aiReply != null && !aiReply.trim().isEmpty()) {
                response.put("reply", aiReply);
                response.put("cars", matchedCars);
                response.put("isAi", true);
                return ResponseEntity.ok(response);
            }

            // 4. CHẾ ĐỘ DỰ PHÒNG THÔNG MINH (Offline Fallback Engine)
            String fallbackReply = buildSmartFallbackReply(userText, matchedCars, allCars, brandMap);
            response.put("reply", fallbackReply);
            response.put("cars", matchedCars);
            response.put("isAi", false);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Lỗi bất ngờ tại ChatbotController: {}", e.getMessage(), e);
            response.put("reply",
                    "Xin chào! Hiện tại hệ thống đang được cập nhật. Anh/chị có thể gọi Hotline **0909.123.456** để được tư vấn trực tiếp ạ!");
            response.put("cars", Collections.emptyList());
            response.put("isAi", false);
            return ResponseEntity.ok(response);
        }
    }

    private List<Car> filterMatchingCars(String userText, List<Car> allCars, Map<Integer, String> brandMap) {
        if (allCars == null || allCars.isEmpty())
            return Collections.emptyList();

        String lowerText = userText.toLowerCase();

        // -------------------------------------------------------------
        // BƯỚC 1: TRÍCH XUẤT TIÊU CHÍ LỌC CỨNG (HARD FILTERS)
        // -------------------------------------------------------------

        // 1. Nhận diện Hãng xe (Toyota, Ford, Honda, Hyundai, Kia, Mazda, Mercedes,
        // BMW...)
        Integer targetBrandId = null;
        for (Map.Entry<Integer, String> entry : brandMap.entrySet()) {
            String bName = entry.getValue().toLowerCase();
            if (lowerText.contains(bName)) {
                targetBrandId = entry.getKey();
                break;
            }
        }

        // 2. Nhận diện Ngân sách giá tối đa (dưới 700tr, dưới 1 tỷ...)
        Double maxBudget = parseMaxBudget(lowerText);

        // 3. Nhận diện Kiểu dáng (Sedan, SUV, Pickup, Hatchback, MPV)
        String targetBodyType = null;
        if (lowerText.contains("sedan"))
            targetBodyType = "sedan";
        else if (lowerText.contains("suv") || lowerText.contains("crossover"))
            targetBodyType = "suv";
        else if (lowerText.contains("bán tải") || lowerText.contains("pickup"))
            targetBodyType = "pickup";
        else if (lowerText.contains("hatchback"))
            targetBodyType = "hatchback";
        else if (lowerText.contains("mpv"))
            targetBodyType = "mpv";

        // 4. Nhận diện Số chỗ ngồi (7 chỗ, 5 chỗ)
        Integer targetSeats = null;
        if (lowerText.contains("7 chỗ") || lowerText.contains("gia đình"))
            targetSeats = 7;
        else if (lowerText.contains("5 chỗ"))
            targetSeats = 5;

        // 5. Nhận diện Màu sắc (Đỏ, Đen, Trắng, Xám, Bạc, Xanh, Vàng, Nâu...)
        String targetColor = null;
        if (lowerText.contains("đỏ") || lowerText.contains("màu đỏ"))
            targetColor = "đỏ";
        else if (lowerText.contains("đen") || lowerText.contains("màu đen"))
            targetColor = "đen";
        else if (lowerText.contains("trắng") || lowerText.contains("màu trắng"))
            targetColor = "trắng";
        else if (lowerText.contains("xám") || lowerText.contains("ghi") || lowerText.contains("màu xám"))
            targetColor = "xám";
        else if (lowerText.contains("bạc") || lowerText.contains("màu bạc"))
            targetColor = "bạc";
        else if (lowerText.contains("xanh") || lowerText.contains("màu xanh"))
            targetColor = "xanh";
        else if (lowerText.contains("vàng") || lowerText.contains("màu vàng"))
            targetColor = "vàng";
        else if (lowerText.contains("nâu") || lowerText.contains("màu nâu"))
            targetColor = "nâu";

        // -------------------------------------------------------------
        // BƯỚC 2: ÁP DỤNG LỌC CỨNG THEO TIÊU CHÍ KHÁCH YÊU CẦU
        // -------------------------------------------------------------
        List<Car> candidateCars = new ArrayList<>(allCars);
        boolean hasFilterApplied = false;

        // Lọc theo Hãng xe
        if (targetBrandId != null) {
            hasFilterApplied = true;
            final Integer bId = targetBrandId;
            List<Car> brandFiltered = candidateCars.stream()
                    .filter(c -> c.getBrandId() != null && c.getBrandId().equals(bId))
                    .collect(Collectors.toList());
            if (!brandFiltered.isEmpty()) {
                candidateCars = brandFiltered;
            }
        }

        // Lọc theo Ngân sách giá tối đa
        if (maxBudget != null) {
            hasFilterApplied = true;
            final Double budget = maxBudget;
            List<Car> budgetFiltered = candidateCars.stream()
                    .filter(c -> c.getPrice() != null && c.getPrice() > 0 && c.getPrice() <= budget)
                    .collect(Collectors.toList());
            if (!budgetFiltered.isEmpty()) {
                candidateCars = budgetFiltered;
            }
        }

        // Lọc theo Kiểu dáng
        if (targetBodyType != null) {
            hasFilterApplied = true;
            final String bType = targetBodyType;
            List<Car> bodyFiltered = candidateCars.stream()
                    .filter(c -> c.getBodyType() != null && c.getBodyType().toLowerCase().contains(bType))
                    .collect(Collectors.toList());
            if (!bodyFiltered.isEmpty()) {
                candidateCars = bodyFiltered;
            }
        }

        // Lọc theo Số chỗ ngồi
        if (targetSeats != null) {
            hasFilterApplied = true;
            final Integer seats = targetSeats;
            List<Car> seatsFiltered = candidateCars.stream()
                    .filter(c -> c.getSeats() != null && c.getSeats().equals(seats))
                    .collect(Collectors.toList());
            if (!seatsFiltered.isEmpty()) {
                candidateCars = seatsFiltered;
            }
        }

        // Lọc theo Màu sắc
        if (targetColor != null) {
            hasFilterApplied = true;
            final String colorKw = targetColor;
            List<Car> colorFiltered = candidateCars.stream()
                    .filter(c -> (c.getColor() != null && c.getColor().toLowerCase().contains(colorKw))
                            || (c.getDescription() != null && c.getDescription().toLowerCase().contains(colorKw)))
                    .collect(Collectors.toList());
            if (!colorFiltered.isEmpty()) {
                candidateCars = colorFiltered;
            }
        }

        // -------------------------------------------------------------
        // BƯỚC 3: CHẤM ĐIỂM XẾP HẠNG TÊN XE CỤ THỂ
        // -------------------------------------------------------------
        String cleanText = lowerText.replaceAll(
                "(?i)\\b(tìm|kiếm|cho|tôi|xem|cần|mua|bán|có|không|giúp|báo|giá|tư|vấn|xe|hơi|ô|tô|chiếc|mẫu|dưới|tr|triệu|tỷ|tỉ|chỗ|dòng|màu|mệnh|hợp|với|của|mình)\\b",
                " ")
                .replaceAll("\\s+", " ")
                .trim();

        String[] keywords = cleanText.isEmpty() ? new String[0] : cleanText.split(" ");

        Map<Car, Integer> scoreMap = new HashMap<>();
        for (Car car : candidateCars) {
            int score = hasFilterApplied ? 10 : 0;
            String carName = car.getName() != null ? car.getName().toLowerCase() : "";

            for (String kw : keywords) {
                if (kw.length() < 2)
                    continue;
                if (carName.contains(kw)) {
                    score += 20;
                }
            }

            if (score > 0) {
                scoreMap.put(car, score);
            }
        }

        // Sắp xếp xe theo điểm từ cao xuống thấp
        List<Car> sortedCars = scoreMap.entrySet().stream()
                .sorted(Map.Entry.<Car, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Nếu khách hỏi chung chung không lọc màu hay từ khóa cụ thể -> trả về xe nổi
        // bật
        if (sortedCars.isEmpty() && !hasFilterApplied && (lowerText.contains("xe") || lowerText.contains("tìm")
                || lowerText.contains("tư vấn") || lowerText.contains("mua"))) {
            return allCars.stream().limit(4).collect(Collectors.toList());
        }

        return sortedCars.stream().limit(6).collect(Collectors.toList());
    }

    private String buildSmartFallbackReply(String userText, List<Car> matchedCars, List<Car> allCars,
            Map<Integer, String> brandMap) {
        String lowerText = userText.toLowerCase();

        // 1. Chào hỏi
        // Chỉ coi là câu chào nếu từ "hi", "hello", "chào" đứng độc lập dưới dạng một
        // từ nguyên vẹn
        if (lowerText.matches(".*\\b(chào|xin chào|hi|hello)\\b.*")) {
            return "Xin chào! Chào mừng bạn đến với **CarStore**. Em là trợ lý tư vấn tự động. Anh/chị đang quan tâm đến dòng xe nào ạ?";
        }

        // 2. Địa chỉ & Giờ làm việc
        if (lowerText.contains("địa chỉ") || lowerText.contains("ở đâu") || lowerText.contains("showroom")
                || lowerText.contains("vị trí")) {
            return "📍 **Showroom CarStore** tọa lạc tại: **123 Đường ABC, Quận 1, TP. Hồ Chí Minh**.\n" +
                    "⏰ Giờ mở cửa: **08:00 - 20:00** tất cả các ngày trong tuần (kể cả Lễ, Tết).";
        }

        // 3. Liên hệ & Hotline
        if (lowerText.contains("sđt") || lowerText.contains("hotline") || lowerText.contains("liên hệ")
                || lowerText.contains("điện thoại") || lowerText.contains("zalo")) {
            return "📞 Hotline / Zalo tư vấn 24/7 của CarStore: **0909.123.456**.\n" +
                    "Anh/chị có thể gọi ngay hoặc để lại lời nhắn để được hỗ trợ báo giá lăn bánh chi tiết ạ!";
        }

        // 4. Lái thử xe & Đặt lịch
        if (lowerText.contains("lái thử") || lowerText.contains("đặt lịch") || lowerText.contains("trải nghiệm")) {
            return "🚗 CarStore hỗ trợ **Đặt lịch lái thử tận nhà miễn phí**!\n" +
                    "Anh/chị vui lòng chọn nút **Lái thử** trên thẻ xe bên dưới hoặc gọi hotline **0909.123.456** để đăng ký nhé.";
        }

        // 5. Trả góp & Tài chính
        if (lowerText.contains("trả góp") || lowerText.contains("vay") || lowerText.contains("ngân hàng")
                || lowerText.contains("lãi suất")) {
            return "💳 CarStore hỗ trợ mua xe **Trả góp lên đến 80% giá trị xe**, lãi suất ưu đãi chỉ từ 0.6%/tháng, thủ tục duyệt nhanh trong 24h!";
        }

        // 6. Nhận diện tiêu chí lọc (Màu sắc, Hãng xe & Ngân sách)
        String foundColor = null;
        if (lowerText.contains("đỏ") || lowerText.contains("màu đỏ"))
            foundColor = "Đỏ";
        else if (lowerText.contains("đen") || lowerText.contains("màu đen"))
            foundColor = "Đen";
        else if (lowerText.contains("trắng") || lowerText.contains("màu trắng"))
            foundColor = "Trắng";
        else if (lowerText.contains("xám") || lowerText.contains("màu xám"))
            foundColor = "Xám";
        else if (lowerText.contains("bạc") || lowerText.contains("màu bạc"))
            foundColor = "Bạc";
        else if (lowerText.contains("xanh") || lowerText.contains("màu xanh"))
            foundColor = "Xanh";

        String foundBrandName = null;
        for (String bName : brandMap.values()) {
            if (lowerText.contains(bName.toLowerCase())) {
                foundBrandName = bName;
                break;
            }
        }
        Double budget = parseMaxBudget(lowerText);

        if (foundColor != null) {
            if (matchedCars != null && !matchedCars.isEmpty()) {
                return String.format(
                        "🚗 Đối với nhu cầu chọn màu hợp phong thủy, dưới đây là danh sách các mẫu xe **màu %s** hiện đang sẵn có tại CarStore:",
                        foundColor);
            } else {
                return String.format(
                        "Rất tiếc, hiện tại CarStore chưa có mẫu xe **màu %s** nào trong kho. Anh/chị có thể tham khảo thêm các mẫu xe khác bên dưới nhé!",
                        foundColor);
            }
        }

        if (foundBrandName != null && budget != null) {
            long formattedBudget = Math.round(budget / 1_000_000);
            if (matchedCars != null && !matchedCars.isEmpty()) {
                return String.format(
                        "🚗 Dưới đây là danh sách các mẫu xe hãng **%s** có giá dưới **%d triệu VNĐ** hiện đang sẵn có tại CarStore:",
                        foundBrandName, formattedBudget);
            } else {
                return String.format(
                        "Rất tiếc, hiện tại CarStore chưa có mẫu xe **%s** nào trong tầm giá dưới %d triệu. Anh/chị có thể tham khảo thêm các mẫu xe khác bên dưới nhé!",
                        foundBrandName, formattedBudget);
            }
        }

        if (foundBrandName != null) {
            return String.format(
                    "🚗 Dưới đây là danh sách các mẫu xe thuộc thương hiệu **%s** hiện đang có tại CarStore:",
                    foundBrandName);
        }

        if (budget != null) {
            long formattedBudget = Math.round(budget / 1_000_000);
            if (matchedCars != null && !matchedCars.isEmpty()) {
                return String.format(
                        "💰 Dưới đây là các mẫu xe có giá dưới **%d triệu VNĐ** hiện đang sẵn có tại CarStore:",
                        formattedBudget);
            } else {
                return String.format(
                        "Rất tiếc, hiện tại CarStore chưa có mẫu xe nào trong tầm giá dưới %d triệu. Anh/chị có thể tham khảo thêm các mẫu xe khác bên dưới nhé!",
                        formattedBudget);
            }
        }

        if (matchedCars != null && !matchedCars.isEmpty()) {
            return "Dưới đây là các mẫu xe phù hợp nhất với yêu cầu tìm kiếm của bạn tại CarStore:";
        }

        return "Cảm ơn bạn đã nhắn tin cho CarStore! Bạn có thể gõ cụ thể tên xe hoặc nhu cầu:\n" +
                "• Tìm theo màu sắc phong thủy: *'Xe màu đỏ'*, *'Xe màu đen'*\n" +
                "• Tìm theo thương hiệu & giá: *'Xe Toyota dưới 700 triệu'*, *'Xe Ford 7 chỗ'*\n" +
                "• Địa chỉ Showroom & Hotline đặt lịch lái thử.";
    }

    private Double parseMaxBudget(String text) {
        Pattern patternMillion = Pattern.compile("(?:dưới|tầm|khoảng|giá)?\\s*(\\d+)\\s*(?:tr|triệu)");
        Matcher matcherMillion = patternMillion.matcher(text);
        if (matcherMillion.find()) {
            try {
                double val = Double.parseDouble(matcherMillion.group(1));
                return val * 1_000_000;
            } catch (Exception ignored) {
            }
        }

        Pattern patternBillion = Pattern.compile("(?:dưới|tầm|khoảng|giá)?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:tỷ|tỉ)");
        Matcher matcherBillion = patternBillion.matcher(text);
        if (matcherBillion.find()) {
            try {
                double val = Double.parseDouble(matcherBillion.group(1));
                return val * 1_000_000_000;
            } catch (Exception ignored) {
            }
        }

        return null;
    }
}
