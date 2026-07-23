package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Cho phép Vue.js gọi API mà không bị lỗi CORS
public class ChatbotController {

    @Autowired
    private CarRepository carRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> processMessage(@RequestBody(required = false) Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        List<Car> carResults = new ArrayList<>();
        String replyText = "";

        // Tránh crash lỗi 500 nếu payload gửi sang bị rỗng
        if (payload == null || !payload.containsKey("message") || payload.get("message") == null) {
            response.put("reply", "Vui lòng nhập nội dung tin nhắn!");
            response.put("cars", Collections.emptyList());
            return ResponseEntity.badRequest().body(response);
        }

        String userText = payload.get("message").toLowerCase().trim();

        // -------------------------------------------------------------
        // LOGIC 1: CHÀO HỎI & THÔNG TIN SHOWROOM
        // -------------------------------------------------------------
        if (userText.contains("chào") || userText.contains("hi") || userText.contains("hello")) {
            replyText = "Xin chào! Chào mừng bạn đến với Showroom CarStore. Bạn cần tìm mẫu xe nào hôm nay?";
        } 
        else if (userText.contains("địa chỉ") || userText.contains("ở đâu") || userText.contains("showroom")) {
            replyText = "Showroom CarStore tọa lạc tại số 123 Đường ABC, Quận 1, TP.HCM. Giờ mở cửa: 8h00 - 20h00 hàng ngày.";
        } 
        else if (userText.contains("sđt") || userText.contains("hotline") || userText.contains("liên hệ")) {
            replyText = "Bạn có thể gọi trực tiếp hotline tư vấn qua số: 0909.123.456 nhé!";
        }

        // -------------------------------------------------------------
        // LOGIC 2: TÌM XE THEO TÊN / MÔ TẢ (Query trực tiếp Database)
        // -------------------------------------------------------------
        else if (userText.contains("tìm") || userText.contains("xe") || userText.contains("xem")) {
            // Tách các từ thừa để trích xuất từ khóa tìm kiếm
            String keyword = userText.replace("tìm", "")
                                     .replace("kiếm", "")
                                     .replace("cho tôi", "")
                                     .replace("xe", "")
                                     .trim();

            if (!keyword.isEmpty()) {
                // Gọi hàm có sẵn trong CarRepository của bạn
                carResults = carRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
                
                if (!carResults.isEmpty()) {
                    replyText = "Dưới đây là các mẫu xe phù hợp với từ khóa '" + keyword + "' tại CarStore:";
                } else {
                    replyText = "Rất tiếc, CarStore không tìm thấy mẫu xe nào phù hợp với từ khóa '" + keyword + "'.";
                }
            } else {
                replyText = "Bạn muốn tìm mẫu xe gì? (Ví dụ: 'tìm xe Vios', 'tìm xe SUV'...)";
            }
        }

        // -------------------------------------------------------------
        // LOGIC MẶC ĐỊNH (Khi không khớp từ khóa nào)
        // -------------------------------------------------------------
        else {
            replyText = "Cảm ơn bạn đã nhắn tin! Bạn có thể hỏi tôi về:\n" +
                        "1. Tìm xe theo tên/kiểu dáng (VD: 'tìm xe Vios', 'tìm xe Sedan')\n" +
                        "2. Địa chỉ showroom hoặc Hotline liên hệ.";
        }

        response.put("reply", replyText);
        response.put("cars", carResults); // Trả về mảng danh sách xe lấy từ CSDL
        return ResponseEntity.ok(response);
    }
}