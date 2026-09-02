# 🎙️ KỊCH BẢN THUYẾT TRÌNH DỰ ÁN GRADUATION PROJECT: CARSTORE
**Hệ thống Bán Xe Ô Tô & Dịch vụ Bảo dưỡng Thông minh**
*Đồ án Tốt nghiệp - Trường FPT Polytechnic*

---

## ⏱️ I. TỔNG QUAN PHÂN BỔ THỜI GIAN THEO SLIDE (TOTAL: 30 PHÚT)

| Thời gian | Thành viên | Vai trò theo Slide | Slide phụ trách | Nội dung chính |
| :--- | :--- | :--- | :--- | :--- |
| **00:00 - 06:00** *(6 phút)* | **Nguyễn Lâm Gia Kiệt** | Identity & Security *(Trưởng nhóm)* | **Slide 1 ➔ Slide 4** | Mở đầu, Phân tích nghiệp vụ tổng quan, Phân công nhóm & Chi tiết Bảo mật/Xác thực (`OAuth2`, `Spring Security`, `JWT`) |
| **06:00 - 12:00** *(6 phút)* | **Trương Đức Thành** | Catalog & Discovery | **Slide 5, Slide 9, 10** | Phân hệ Danh mục xe (`Car`, `Brand`), Bộ lọc, So sánh xe & Sơ đồ UML Use Case / Sequence |
| **12:00 - 18:00** *(6 phút)* | **Trần Minh Tài** | Commerce & Payment | **Slide 6, Slide 12, 13** | Đặt cọc xe, Cổng thanh toán SePay API, Kiến trúc Công nghệ (`Architecture`) & Sơ đồ CSDL (`ERD`) |
| **18:00 - 24:00** *(6 phút)* | **Quách Thành Danh** | Aftersales & Services | **Slide 7, Slide 11** | Dịch vụ & Hỗ trợ bảo dưỡng (`SupportRequest`), Đánh giá xe, Hợp đồng & Luồng tác vụ Hậu mãi |
| **24:00 - 30:00** *(6 phút)* | **Trần Anh Vũ** | Intelligence & Admin Demo | **Slide 8, 14 ➔ 17** | Dashboard Thống kê, Trợ lý AI Chatbot Gemini, Điểm mạnh hệ thống, Hướng phát triển & **Điều hành Live Demo** |

---

## 🎙️ II. KỊCH BẢN NÓI CHI TIẾT THEO TỪNG SLIDE (SLIDE 1 ➔ SLIDE 17)

---

### 👤 THÀNH VIÊN 1: NGUYỄN LÂM GIA KIỆT (IDENTITY & SECURITY)
⏱️ **Thời lượng:** 00:00 - 06:00 (6 phút) | **Slide 1 ➔ Slide 4**

#### 📌 Slide 1: Trang Bìa Dự Án (CarStore / Graduation Project - FPT Polytechnic)
* **Lời thoại:**
> *"Kính chào Chủ tịch Hội đồng, quý Thầy/Cô và toàn thể các bạn sinh viên! Em xin đại diện cho Nhóm báo cáo Đồ án Tốt nghiệp với đề tài **CarStore – Website Bán Xe Ô Tô & Dịch vụ Bảo dưỡng**.*
> *Nhóm thực hiện gồm 5 thành viên:*
> 1. *Em là **Nguyễn Lâm Gia Kiệt** - Phụ trách Xác thực & Bảo mật.*
> 2. *Bạn **Trương Đức Thành** - Phụ trách Danh mục xe & Tìm kiếm.*
> 3. *Bạn **Trần Minh Tài** - Phụ trách Đặt xe & Thanh toán SePay.*
> 4. *Bạn **Quách Thành Danh** - Phụ trách Dịch vụ & Hợp đồng.*
> 5. *Và bạn **Trần Anh Vũ** - Phụ trách Dashboard, AI Chatbot & Tin tức."*

#### 📌 Slide 2: Phân Tích Nghiệp Vụ Tổng Quan
* **Lời thoại:**
> *"Thưa Thầy/Cô, hành trình sở hữu ô tô trực tuyến của khách hàng hiện đại đòi hỏi sự liền mạch qua 5 giai đoạn cốt lõi:*
> 1. ***Tìm kiếm (Search):** Tra cứu dòng xe phù hợp với nhu cầu và ngân sách.*
> 2. ***So sánh (Compare):** Đặt lên bàn cân các thông số kỹ thuật giữa các dòng xe.*
> 3. ***Đặt cọc (Deposit):** Thực hiện giao dịch giữ chỗ xe an toàn trực tuyến.*
> 4. ***Hợp đồng (Contract):** Hoàn thiện hồ sơ và hợp đồng mua bán xe.*
> 5. ***Hậu mãi (Aftersales):** Đặt lịch bảo dưỡng và chăm sóc xe định kỳ.*
> *Mục tiêu của dự án CarStore là kết nối 5 giai đoạn này thành một trải nghiệm số hóa nhất quán."*

#### 📌 Slide 3: Phân Công Nhiệm Vụ Nhóm 5 Thành Viên
* **Lời thoại:**
> *"Để xây dựng hệ thống đáp ứng trọn vẹn nghiệp vụ trên, nhóm đã phân chia trách nhiệm thành 5 mảng chuyên sâu:*
> - *Mảng **Identity & Security** (Do em - Gia Kiệt phụ trách).*
> - *Mảng **Catalog & Discovery** (Bạn Đức Thành phụ trách).*
> - *Mảng **Commerce** (Bạn Minh Tài phụ trách).*
> - *Mảng **Aftersales** (Bạn Thành Danh phụ trách).*
> - *Mảng **Intelligence** (Bạn Anh Vũ phụ trách).*
> *Mỗi thành viên làm chủ cả Frontend, Backend và Database cho phân hệ của mình."*

#### 📌 Slide 4: Chi Tiết Nhiệm Vụ Thành Viên 01 - Nguyễn Lâm Gia Kiệt
* **Lời thoại:**
> *"Đi sâu vào phần nhiệm vụ của em – **Identity & Security**:*
> - *Em chịu trách nhiệm toàn bộ luồng Đăng ký, Đăng nhập và Phân quyền người dùng (`ROLE_USER`, `ROLE_ADMIN`).*
> - *Áp dụng công nghệ **Spring Security** kết hợp **Google OAuth2** (`CustomOAuth2UserService`) giúp người dùng đăng nhập nhanh chóng bằng tài khoản Google.*
> - *Về cấu trúc Backend, em xây dựng `AccountController`, `AuthService` để quản lý các endpoint xác thực an toàn, mã hóa mật khẩu bằng BCrypt và chuẩn bị cấu trúc Token JWT.*
> *Tiếp theo, em xin mời bạn **Trương Đức Thành** trình bày về Phân hệ Danh mục xe và Tìm kiếm."*

---

### 👤 THÀNH VIÊN 2: TRƯƠNG ĐỨC THÀNH (CATALOG & DISCOVERY)
⏱️ **Thời lượng:** 06:00 - 12:00 (6 phút) | **Slide 5, Slide 9, Slide 10**

#### 📌 Slide 5: Chi Tiết Nhiệm Vụ Thành Viên 02 - Trương Đức Thành
* **Lời thoại:**
> *"Em xin cảm ơn bạn Gia Kiệt. Kính chào Thầy/Cô, em là **Trương Đức Thành**, phụ trách mảng **Catalog & Discovery**.*
> - *Em phát triển tính năng **Tìm kiếm, Lọc nâng cao** theo Hãng xe (Brand), Tầm giá, Loại nhiên liệu và Kiểu dáng (BodyType).*
> - *Xây dựng công cụ **So sánh xe đa chiều**, hỗ trợ so sánh song song tối đa 3 mẫu xe cùng lúc.*
> - *Phía Backend, em chịu trách nhiệm `CarController`, `BrandService`, quản lý các thực thể `cars`, `brands` và bộ sưu tập `images`."*

#### 📌 Slide 9: UML & Specifications - Ba Góc Nhìn
* **Lời thoại:**
> *"Để hệ thống đạt chuẩn thiết kế phần mềm, nhóm tiếp cận kiến trúc qua 3 góc nhìn UML nhất quán:*
> 1. ***Góc nhìn Use Case:** Tập trung vào các tác vụ Đặt mua xe, Tạo hợp đồng và Yêu cầu dịch vụ.*
> 2. ***Góc nhìn Sequence:** Chuẩn hóa luồng tác vụ: Khách chọn xe ➔ Kiểm tra tồn kho ➔ Tạo đơn hàng ➔ Xác nhận.*
> 3. ***Góc nhìn Class Layered:** Thiết kế hệ thống phân tầng mạch lạc: `Controller` ➔ `Service` ➔ `Repository`."*

#### 📌 Slide 10: Sơ Đồ Use Case Tổng Quan
* **Lời thoại:**
> *"Trên màn hình là **Sơ đồ Use Case tổng quan** của dự án. Hệ thống được chia làm 2 Actor chính:*
> - ***Khách hàng:** Có thể tìm kiếm/lọc xe, so sánh xe, đặt cọc qua SePay, gửi yêu cầu bảo dưỡng và tương tác với Chatbot AI.*
> - ***Quản trị viên (Admin):** Quản lý danh mục xe, quản lý tài khoản, duyệt đơn hàng, xử lý yêu cầu dịch vụ và xem thống kê vận hành.*
> *Xin mời bạn **Trần Minh Tài** tiếp tục trình bày về Module Đặt xe, Thanh toán SePay và Cơ sở dữ liệu."*

---

### 👤 THÀNH VIÊN 3: TRẦN MINH TÀI (COMMERCE & PAYMENT)
⏱️ **Thời lượng:** 12:00 - 18:00 (6 phút) | **Slide 6, Slide 12, Slide 13**

#### 📌 Slide 6: Chi Tiết Nhiệm Vụ Thành Viên 03 - Trần Minh Tài
* **Lời thoại:**
> *"Cảm ơn bạn Đức Thành. Kính chào Thầy/Cô, em là **Trần Minh Tài**, phụ trách mảng **Commerce - Đặt xe & Thanh toán**.*
> - *Em chịu trách nhiệm xử lý Giỏ hàng (`Cart`), Quản lý Đơn hàng (`Orders`) và luồng Đặt cọc giữ xe trực tuyến.*
> - *Tích hợp thành công **Cổng thanh toán SePay API**: Cho phép khách hàng chuyển khoản đặt cọc giữ xe tự động qua mã VietQR, xác nhận Webhook thời gian thực mà không cần nhân viên kiểm tra thủ công."*

#### 📌 Slide 12: Sơ Đồ Công Nghệ Sử Dụng (CarStore Architecture)
* **Lời thoại:**
> *"Xin kính mời Thầy/Cô quan sát **Sơ đồ Kiến trúc Công nghệ CarStore** trên Slide:*
> - ***Layer 1 - Frontend Layer:** Xây dựng bằng **Vue.js 3 (Vite, Pinia, Axios)** chạy dạng Single Page Application (SPA).*
> - ***Layer 2 - Backend Layer:** Nền tảng **Java 17 & Spring Boot**, tích hợp Spring Security bảo mật toàn bộ REST API.*
> - ***Layer 3 - External Services Layer:** Tích hợp 3 dịch vụ bên ngoài gồm Google OAuth2, Gmail SMTP gửi email thông báo và **SePay Payment API**.*
> - ***Layer 4 - Database Layer:** Sử dụng **Microsoft SQL Server** cho Production và H2 Embedded DB cho môi trường thử nghiệm."*

#### 📌 Slide 13: Sơ Đồ Cơ Sở Dữ Liệu ERD
* **Lời thoại:**
> *"Cơ sở dữ liệu của dự án được chuẩn hóa ở cấp độ 3NF:*
> - *Bảng `Orders` liên kết 1-N với `OrderDetail` và `Account`.*
> - *Bảng `PaymentTransaction` lưu trữ mã giao dịch, số tiền cọc, cổng thanh toán và trạng thái xác nhận từ SePay.*
> - *Toàn bộ quy trình Checkout cọc được bọc trong Annotation `@Transactional`, đảm bảo nếu có lỗi ở bất kỳ bước nào, hệ thống sẽ tự động Rollback an toàn.*
> *Sau đây, xin mời bạn **Quách Thành Danh** trình bày về phân hệ Dịch vụ & Hợp đồng."*

---

### 👤 THÀNH VIÊN 4: QUÁCH THÀNH DANH (AFTERSALES & CONTRACT)
⏱️ **Thời lượng:** 18:00 - 24:00 (6 phút) | **Slide 7, Slide 11**

#### 📌 Slide 7: Chi Tiết Nhiệm Vụ Thành Viên 04 - Quách Thành Danh
* **Lời thoại:**
> *"Em xin cảm ơn bạn Minh Tài. Kính chào Thầy/Cô, em là **Quách Thành Danh**, phụ trách mảng **Aftersales - Dịch vụ & Hợp đồng**.*
> - *Em phát triển phân hệ **Đặt lịch Dịch vụ & Hỗ trợ** (`SupportRequest`), giúp khách hàng đặt hẹn bảo dưỡng, sửa chữa hoặc yêu cầu tư vấn.*
> - *Xây dựng tính năng **Đánh giá xe** và **Quản lý Hợp đồng mua bán** (`Contract`), hỗ trợ tạo và lưu trữ thông tin hợp đồng sau khi đặt cọc.*
> - *Backend em phụ trách các service nghiệp vụ: `Service`, `Support`, `Contract`."*

#### 📌 Slide 11: Use Case Tổng Quan & Luồng Tác Vụ Chính
* **Lời thoại:**
> *"Slide 11 minh họa luồng làm việc song song giữa Khách hàng và Admin/Nhân viên:*
> - ***Phía Khách hàng:** Xác thực tài khoản ➔ Tìm/So sánh xe ➔ Đặt cọc ➔ Theo dõi đơn hàng ➔ Đặt lịch bảo dưỡng ➔ Gửi yêu cầu hỗ trợ.*
> - ***Phía Admin / Nhân viên:** Quản lý danh mục xe ➔ Duyệt đơn hàng ➔ Xử lý yêu cầu dịch vụ & hợp đồng ➔ Quản lý khuyến mãi ➔ Theo dõi Dashboard vận hành.*
> *Quy trình này tạo ra chuỗi tương tác khép kín giữa showroom và người mua xe.*
> *Tiếp theo, xin mời bạn **Trần Anh Vũ** trình bày về AI Chatbot, Dashboard và điều khiển phần Live Demo."*

---

### 👤 THÀNH VIÊN 5: TRẦN ANH VŨ (INTELLIGENCE, DEMO & KẾT LUẬN)
⏱️ **Thời lượng:** 24:00 - 30:00 (6 phút) | **Slide 8, 14 ➔ 17**

#### 📌 Slide 8: Chi Tiết Nhiệm Vụ Thành Viên 05 - Trần Anh Vũ
* **Lời thoại:**
> *"Cảm ơn bạn Thành Danh. Em xin chào Thầy/Cô, em là **Trần Anh Vũ**, phụ trách mảng **Intelligence - Dữ liệu & Tương tác**.*
> - *Em phát triển **Dashboard Thống kê Vận hành** cho Admin: Cung cấp 1 API tổng hợp (`dashboard-info`) thống kê tổng tiền cọc, số lượng xe bán chạy, tổng đơn hàng và tài khoản.*
> - *Tích hợp **Trợ lý AI Chatbot (Google Gemini API)**: Đóng vai trò tư vấn viên 24/7, có khả năng đọc CSDL xe thực tế để gợi ý xe và báo giá chính xác.*
> - *Xây dựng phân hệ **Tin tức & Khuyến mãi** giúp thu hút trải nghiệm người dùng."*

#### 📌 Slide 14: Điểm Mạnh Hệ Thống CarStore
* **Lời thoại:**
> *"Tổng kết lại, CarStore tự hào sở hữu 5 Điểm mạnh nổi bật:*
> 1. *Quy trình nghiệp vụ bán ô tô & dịch vụ bảo dưỡng khép kín, liền mạch.*
> 2. *Giao diện Vue 3 Single Page Application hiện đại, tốc độ phản hồi cao.*
> 3. *Chatbot AI tư vấn tự động đọc dữ liệu CSDL thông minh.*
> 4. *Dashboard thống kê & Hệ thống phân quyền chặt chẽ.*
> 5. *Cơ sở dữ liệu được thiết kế chuẩn hóa 3NF an toàn."*

#### 📌 Slide 15 & 16: Hạn Chế, Hướng Phát Triển Tương Lai & Kết Luận
* **Lời thoại:**
> *"Về Hướng phát triển tương lai (Slide 15): Nhóm hướng tới nâng cấp AI tư vấn cá nhân hóa, tích hợp sâu Cổng thanh toán & Chữ ký số (E-Sign), mở rộng ứng dụng Mobile App iOS/Android.*
> *Kết luận (Slide 16): Dự án CarStore đã hoàn thành **ĐẦY ĐỦ - MỞ RỘNG - KHẢ THI** và sẵn sàng đưa vào vận hành thực tế!"*

---

### 🎬 SLIDE 17: CÂU HỎI & THẢO LUẬN - KỊCH BẢN LIVE DEMO TRỰC TIẾP (3 PHÚT)

* **Lời thoại mở đầu phần Demo:**
> *"Sau đây, em xin phép được đại diện nhóm trình chiếu **Live Demo trực tiếp hệ thống CarStore** trên màn hình."*

#### 📝 Kịch bản điều khiển màn hình Demo chi tiết:
1. **[Đức Thành thuyết minh]:** Mở trang chủ ➔ Lọc xe hãng `Toyota` / `BMW` ➔ Chọn 2 mẫu xe bấm **"So sánh"** ➔ Màn hình hiển thị bảng so sánh thông số kỹ thuật song song.
2. **[Anh Vũ thuyết minh]:** Bấm biểu tượng Chatbot góc dưới ➔ Gõ: *"Tôi muốn mua xe SUV tầm 1 tỷ tại showroom?"* ➔ AI Gemini đọc CSDL và tư vấn đúng mẫu xe kèm giá ➔ Gõ câu hỏi bẫy: *"Cách nấu phở bò thế nào?"* ➔ AI từ chối lịch sự và mời quay lại tư vấn xe.
3. **[Minh Tài thuyết minh]:** Chọn 1 xe ➔ Bấm **Thêm vào giỏ** ➔ Tiến hành Checkout ➔ Màn hình hiện mã **QR Thanh toán SePay** ➔ Mô phỏng Webhook xác thực cọc thành công ➔ Đơn hàng chuyển trạng thái `PAID_DEPOSIT`.
4. **[Thành Danh thuyết minh]:** Chuyển sang mục **Đặt lịch dịch vụ** ➔ Điền thông tin, chọn loại `SERVICE` và chọn ngày giờ ➔ Bấm gửi yêu cầu thành công.
5. **[Gia Kiệt & Anh Vũ thuyết minh]:** Đăng xuất ➔ Đăng nhập Google OAuth2 tài khoản Admin ➔ Mở **Admin Dashboard** ➔ Doanh thu cọc 150.000.000 VNĐ và lịch hẹn dịch vụ mới lập tức xuất hiện realtime!

* **Lời kết thúc:**
> *"Nhóm em xin chân thành cảm ơn quý Thầy/Cô trong Hội đồng đã lắng nghe. Nhóm em xin sẵn sàng bước vào phần Q&A!"*

---

## 🧠 III. BỘ CÂU HỎI PHẢN BIỆN CHUYÊN SÂU & HƯỚNG DẪN TRẢ LỜI (Q&A)

| Câu hỏi phản biện từ Hội đồng | Thành viên trả lời | Câu trả lời ghi điểm tối đa |
| :--- | :--- | :--- |
| **Q1: Tại sao em vừa dùng Spring Security Session vừa ghi trên Slide là JWT?** | **Nguyễn Lâm Gia Kiệt** | *"Dạ thưa Thầy/Cô, ở phiên bản Web hiện tại nhóm chạy chung Domain nên dùng Spring Security Session Cookie với `HttpOnly` để bảo mật tối đa chống tấn công XSS. Phần Service JWT nhóm đã xây dựng sẵn trong `AuthService` để phục vụ cho việc mở rộng API trên Mobile App ở Slide 15 ạ."* |
| **Q2: Thanh toán SePay hoạt động như thế nào và có an toàn không?** | **Trần Minh Tài** | *"Dạ thưa Thầy/Cô, SePay sử dụng cơ chế Webhook. Khi khách quét mã VietQR và chuyển khoản thành công, SePay bắn Webhook kèm mã Checksum bí mật về backend. Backend xác thực chữ ký hợp lệ rồi mới cập nhật đơn hàng thành `PAID_DEPOSIT`, tuyệt đối ngăn chặn việc sửa đổi số tiền trên đường truyền."* |
| **Q3: Làm sao Chatbot AI Gemini đọc được dữ liệu xe trong CSDL của em?** | **Trần Anh Vũ** | *"Dạ thưa Thầy/Cô, trong `GeminiService.java`, trước khi gửi prompt của user lên API, backend sẽ tự động query các mẫu xe trong DB và inject vào chuỗi System Prompt. Nhờ vậy AI luôn tư vấn chuẩn xác 100% giá bán và tồn kho thực tế của Showroom ạ."* |
| **Q4: Nếu 2 người cùng đặt cọc chiếc xe cuối cùng cùng một lúc thì xử lý thế nào?** | **Trần Minh Tài** / **Gia Kiệt** | *"Dạ thưa Thầy/Cô, hàm `checkout()` trong `OrderService` được đánh dấu `@Transactional`. Khi xử lý, hệ thống khóa dòng và kiểm tra tồn kho `Car.stock`. Người đặt cọc trước sẽ trừ kho thành công, người thứ hai sẽ nhận thông báo hết hàng và giao dịch của người thứ hai tự động Rollback an toàn."* |

---
*File được trích xuất trực tiếp từ Slide đồ án `DỰ ÁN.pdf` - FPT Polytechnic.*
