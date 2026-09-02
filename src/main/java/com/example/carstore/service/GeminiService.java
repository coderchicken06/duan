package com.example.carstore.service;

import com.example.carstore.entity.Car;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key:}")
    private String apiKey;

    private static final List<String> API_ENDPOINTS = Arrays.asList(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    );

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        if (!StringUtils.hasText(apiKey) || apiKey.contains("YourActualGeminiApiKeyHere")) {
            String loadedKey = loadKeyFromEnvFile();
            if (StringUtils.hasText(loadedKey)) {
                this.apiKey = loadedKey;
                logger.info(">>> Đã nạp thành công GEMINI_API_KEY từ file .env.");
            }
        }

        if (isConfigured()) {
            logger.info(">>> Gemini AI Chatbot đã được cấu hình Key!");
        } else {
            logger.warn(">>> GEMINI_API_KEY chưa hợp lệ. Chatbot sẽ chạy ở chế độ Offline Fallback.");
        }
    }

    private String loadKeyFromEnvFile() {
        try {
            Path[] potentialPaths = new Path[]{
                Paths.get(".env"),
                Paths.get("../.env"),
                Paths.get("duan/.env")
            };

            for (Path path : potentialPaths) {
                if (Files.exists(path)) {
                    List<String> lines = Files.readAllLines(path);
                    for (String line : lines) {
                        line = line.trim();
                        if (line.startsWith("GEMINI_API_KEY=")) {
                            String val = line.substring("GEMINI_API_KEY=".length()).trim();
                            if (StringUtils.hasText(val) && !val.contains("YourActualGeminiApiKeyHere")) {
                                return val;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Không thể đọc file .env: {}", e.getMessage());
        }
        return null;
    }

    public boolean isConfigured() {
        if (!StringUtils.hasText(apiKey) || apiKey.contains("YourActualGeminiApiKeyHere")) {
            String loaded = loadKeyFromEnvFile();
            if (StringUtils.hasText(loaded)) {
                this.apiKey = loaded;
                return true;
            }
            return false;
        }
        return true;
    }

    public String generateReply(String userMessage, List<Car> cars) {
        if (!isConfigured()) {
            return null;
        }

        String cleanKey = apiKey.trim();
        String prompt = buildPrompt(userMessage, cars);

        Map<String, Object> textPart = Collections.singletonMap("text", prompt);
        Map<String, Object> partsObj = Collections.singletonMap("parts", Collections.singletonList(textPart));
        Map<String, Object> requestBody = Collections.singletonMap("contents", Collections.singletonList(partsObj));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        for (String endpointUrl : API_ENDPOINTS) {
            try {
                String fullUrl = endpointUrl + "?key=" + cleanKey;
                ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, entity, String.class);

                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    JsonNode rootNode = objectMapper.readTree(response.getBody());
                    JsonNode candidates = rootNode.path("candidates");
                    if (candidates.isArray() && candidates.size() > 0) {
                        JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                        if (!textNode.isMissingNode()) {
                            return textNode.asText().trim();
                        }
                    }
                }
            } catch (HttpClientErrorException.TooManyRequests e) {
                logger.error("⚠️ GEMINI API KEY ĐÃ HẾT QUOTA / LƯỢT DÙNG MIỄN PHÍ (429 Quota Exceeded). Chi tiết: {}", e.getMessage());
                break; // Hết quota thì ngưng thử endpoint khác
            } catch (Exception e) {
                logger.error("Lỗi kết nối Gemini API URL [{}]: {}", endpointUrl, e.getMessage());
            }
        }

        return null;
    }

    private String buildPrompt(String userMessage, List<Car> cars) {
        StringBuilder catalog = new StringBuilder();
        if (cars != null && !cars.isEmpty()) {
            catalog.append("DANH SÁCH XE HIỆN CÓ TẠI SHOWROOM:\n");
            int count = 0;
            for (Car car : cars) {
                if (count++ >= 15) break;
                catalog.append(String.format("- ID: %d | Tên: %s | Giá: %,.0f VNĐ | Năm: %s | Kiểu dáng: %s | Động cơ/Nhiên liệu: %s | Tình trạng kho: %d xe\n  Mô tả: %s\n",
                        car.getId(),
                        car.getName(),
                        car.getPrice() != null ? car.getPrice() : 0,
                        car.getYear() != null ? car.getYear() : "N/A",
                        car.getBodyType() != null ? car.getBodyType() : "N/A",
                        car.getFuelType() != null ? car.getFuelType() : "N/A",
                        car.getStock() != null ? car.getStock() : 0,
                        car.getDescription() != null ? car.getDescription() : "Không có mô tả"
                ));
            }
        } else {
            catalog.append("Hiện tại không có thông tin chi tiết xe trong danh mục.\n");
        }

        return "Bạn là Trợ lý AI Tư vấn bán xe cực kỳ thân thiện, lịch sự và am hiểu của Showroom 'CarStore'.\n\n" +
                "THÔNG TIN SHOWROOM CARSTORE:\n" +
                "- Địa chỉ: Số 123 Đường ABC, Quận 1, TP. Hồ Chí Minh\n" +
                "- Hotline/Zalo tư vấn: 0909.123.456\n" +
                "- Giờ mở cửa: 08:00 - 20:00 tất cả các ngày trong tuần (kể cả Lễ, Tết)\n" +
                "- Dịch vụ: Mua bán xe hơi mới & đã qua sử dụng, Đặt lịch lái thử tận nơi, Hỗ trợ trả góp lãi suất ưu đãi, Bảo hành chính hãng.\n\n" +
                catalog.toString() + "\n" +
                "HƯỚNG DẪN TRẢ LỜI:\n" +
                "1. Trả lời câu hỏi của khách hàng bằng tiếng Việt một cách tự nhiên, chu đáo và ngắn gọn (dưới 200 từ).\n" +
                "2. Nếu khách hỏi mua xe/tìm xe, dựa vào Danh sách xe ở trên để tư vấn mẫu xe phù hợp nhất với tầm giá, mục đích hoặc nhu cầu của khách.\n" +
                "3. Nêu rõ Tên xe và Giá niêm yết (nếu có trong danh sách xe).\n" +
                "4. Mời khách hàng để lại Số điện thoại hoặc bấm nút 'Đặt lịch lái thử' / liên hệ Hotline 0909.123.456 để được trải nghiệm trực tiếp.\n" +
                "5. Nếu câu hỏi của khách hàng KHÔNG LIÊN QUAN đến xe hơi, ô tô, mua bán xe, showroom hoặc dịch vụ tư vấn xe (ví dụ: thời tiết, giải toán, lập trình, nấu ăn, tin tức xã hội...), hãy lịch sự từ chối và khéo léo mời khách hàng quay lại chủ đề tư vấn mua xe của CarStore.\n\n" +
                "CÂU HỎI CỦA KHÁCH HÀNG: \"" + userMessage + "\"";
    }
}
