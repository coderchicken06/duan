package com.example.carstore.service;

import com.example.carstore.entity.Account;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.OrderDetail;
import com.example.carstore.entity.PaymentTransaction;
import com.example.carstore.repository.BrandRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MailService {

    private final JavaMailSender mailSender;
    private final BrandRepository brandRepo;
    @Value("${app.frontend.base-url:http://192.168.1.63:5173}")
    private String frontendBaseUrl;

    public MailService(JavaMailSender mailSender, BrandRepository brandRepo) {
        this.mailSender = mailSender;
        this.brandRepo = brandRepo;
    }

    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("CarStore - Mã OTP đặt lại mật khẩu");
        message.setText("Mã OTP của bạn là: " + otp + "\nMã có hiệu lực trong 10 phút.");

        mailSender.send(message);
    }

    public void sendEmailVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("CarStore - Xác thực địa chỉ email");
        message.setText("Mã xác thực tài khoản CarStore của bạn là: " + code
                + "\nMã có hiệu lực trong 15 phút."
                + "\nNếu bạn không đăng ký tài khoản, hãy bỏ qua email này.");
        mailSender.send(message);
    }

    public void sendSePayPaymentSuccess(String toEmail, Integer orderId, double amount, boolean admin) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(admin
                ? "CarStore - Đơn hàng đã thanh toán qua SePay"
                : "CarStore - Xác nhận thanh toán thành công");
        message.setText((admin
                ? "Đơn hàng #" + orderId + " đã nhận thanh toán qua SePay."
                : "Thanh toán cho đơn hàng #" + orderId + " của bạn đã được xác nhận.")
                + "\nSố tiền: " + String.format("%,.0f", amount) + " VNĐ"
                + "\nNội dung chuyển khoản: VELOR" + orderId);
        mailSender.send(message);
    }

    public void sendInvoiceEmail(Account account, Orders order, PaymentTransaction transaction) {
        sendInvoiceEmail(account, order, transaction, List.of(), "");
    }

    public void sendInvoiceEmail(Account account, Orders order, PaymentTransaction transaction,
            List<OrderDetail> details, String transferContent) {
        if (account == null || account.getEmail() == null || account.getEmail().isBlank()) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String recipientName = escapeHtml(account.getFullname() != null && !account.getFullname().isBlank()
                    ? account.getFullname() : account.getUsername());
            String transactionNo = transaction != null && transaction.getTransactionNo() != null
                    ? transaction.getTransactionNo()
                    : "N/A";
            String paidAt = transaction != null && transaction.getPaidAt() != null
                    ? new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(transaction.getPaidAt())
                    : new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(System.currentTimeMillis());
            String depositAmount = transaction != null && transaction.getAmount() != null
                    ? String.format("%,.0f", transaction.getAmount()) + " VNĐ"
                    : "0 VNĐ";
            String orderId = order != null && order.getId() != null ? String.valueOf(order.getId()) : "N/A";
            String productName = firstCarName(details, orderId);
            String transferNote = escapeHtml(transferContent == null || transferContent.isBlank()
                    ? "VELOR" + orderId : transferContent);
            String carRows = details == null || details.isEmpty()
                    ? "<tr><td colspan='3' style='padding:12px; border:1px solid #e5e7eb;'>Chi tiết xe đang được cập nhật.</td></tr>"
                    : details.stream().map(this::carRow).collect(Collectors.joining());

            String html = "<html><body style='font-family: Arial, sans-serif; color: #1f2937;'>"
                    + "<div style='max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;'>"
                    + "<h2 style='color: #b91c1c; margin: 0 0 8px;'>Hóa đơn điện tử &amp; Hợp đồng mua bán xe CarStore</h2>"
                    + "<p>Xin chào <strong>" + recipientName + "</strong>,</p>"
                    + "<p>Thanh toán của bạn đã được CarStore xác nhận thành công.</p>"
                    + "<table style='width:100%; border-collapse:collapse; margin-top:16px;'><tbody>"
                    + "<tr><td style='padding:8px; font-weight:700; width:42%;'>Mã giao dịch</td><td style='padding:8px;'>" + escapeHtml(transactionNo) + "</td></tr>"
                    + "<tr><td style='padding:8px; font-weight:700;'>Ngày giờ thanh toán</td><td style='padding:8px;'>" + paidAt + "</td></tr>"
                    + "<tr><td style='padding:8px; font-weight:700;'>Tên sản phẩm</td><td style='padding:8px;'>" + escapeHtml(productName) + "</td></tr>"
                    + "<tr><td style='padding:8px; font-weight:700;'>Số tiền đã thanh toán</td><td style='padding:8px;'>" + depositAmount + "</td></tr>"
                    + "<tr><td style='padding:8px; font-weight:700;'>Phương thức / nội dung</td><td style='padding:8px;'>SePay / " + transferNote + "</td></tr>"
                    + "<tr><td style='padding:8px; font-weight:700;'>Trạng thái</td><td style='padding:8px; color:#15803d; font-weight:700;'>ĐÃ THANH TOÁN (PAID) / HOÀN TẤT ĐẶT CỌC</td></tr>"
                    + "</tbody></table>"
                    + "<h3 style='margin:24px 0 8px; color:#1f2937;'>Chi tiết xe</h3>"
                    + "<table style='width:100%; border-collapse:collapse;'><thead><tr style='background:#f3f4f6;'><th style='padding:10px; border:1px solid #e5e7eb; text-align:left;'>Tên xe</th><th style='padding:10px; border:1px solid #e5e7eb; text-align:left;'>Hãng xe</th><th style='padding:10px; border:1px solid #e5e7eb; text-align:right;'>Số tiền</th></tr></thead><tbody>"
                    + carRows + "</tbody></table>"
                    + "<h3 style='margin:24px 0 8px; color:#1f2937;'>Hợp đồng &amp; nhận xe</h3>"
                    + "<p>Hợp đồng mua bán điện tử của bạn đã được kích hoạt trên hệ thống CarStore. Quý khách có thể xem và quản lý hợp đồng trực tiếp tại mục Hợp đồng trên website khi đăng nhập tài khoản.</p>"
                    + "<p>Chuẩn bị khi nhận xe: CCCD/CMND, giấy tờ theo thông tin đăng ký xe, biên nhận thanh toán và email xác nhận này.</p>"
                    + "<p style='margin-top: 18px;'>Cảm ơn bạn đã tin tưởng CarStore.</p>"
                    + "</div></body></html>";

            helper.setTo(account.getEmail());
            helper.setSubject("CarStore - Hóa đơn xác nhận thanh toán SePay");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception exception) {
            throw new IllegalStateException("Không thể gửi email hóa đơn thanh toán.", exception);
        }
    }



    private String carRow(OrderDetail detail) {
        String carName = detail.getCar() == null ? "Chưa xác định" : detail.getCar().getName();
        String brandName = detail.getCar() == null || detail.getCar().getBrandId() == null
                ? "Chưa xác định"
                : brandRepo.findById(detail.getCar().getBrandId()).map(brand -> brand.getName()).orElse("Chưa xác định");
        double lineTotal = (detail.getPrice() == null ? 0D : detail.getPrice())
                * (detail.getQuantity() == null ? 0 : detail.getQuantity());
        return "<tr><td style='padding:10px; border:1px solid #e5e7eb;'>" + escapeHtml(carName)
                + "</td><td style='padding:10px; border:1px solid #e5e7eb;'>" + escapeHtml(brandName)
                + "</td><td style='padding:10px; border:1px solid #e5e7eb; text-align:right;'>"
                + String.format("%,.0f VNĐ", lineTotal) + "</td></tr>";
    }

    private String firstCarName(List<OrderDetail> details, String orderId) {
        if (details != null && !details.isEmpty()) {
            OrderDetail detail = details.get(0);
            if (detail != null && detail.getCar() != null && detail.getCar().getName() != null
                    && !detail.getCar().getName().isBlank()) {
                return detail.getCar().getName();
            }
        }
        return "Xe thuộc đơn hàng #" + orderId;
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }
}
