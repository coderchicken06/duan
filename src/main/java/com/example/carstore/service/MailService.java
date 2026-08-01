package com.example.carstore.service;

import com.example.carstore.entity.Account;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.PaymentTransaction;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.text.SimpleDateFormat;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
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
        if (account == null || account.getEmail() == null || account.getEmail().isBlank()) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String recipientName = account.getFullname() != null && !account.getFullname().isBlank()
                    ? account.getFullname()
                    : account.getUsername();
            String transactionNo = transaction != null && transaction.getTransactionNo() != null
                    ? transaction.getTransactionNo()
                    : "N/A";
            String paidAt = transaction != null && transaction.getPaidAt() != null
                    ? new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(transaction.getPaidAt())
                    : new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(System.currentTimeMillis());
            String depositAmount = order != null && order.getDepositAmount() != null
                    ? String.format("%,.0f", order.getDepositAmount()) + " VNĐ"
                    : "0 VNĐ";
            String contractCode = order != null && order.getId() != null ? "VELOR" + order.getId() : "N/A";
            String deliveryAddress = order != null && order.getAddress() != null && !order.getAddress().isBlank()
                    ? order.getAddress()
                    : "Chưa cung cấp";

            String html = "<html><body style='font-family: Arial, sans-serif; color: #1f2937;'>"
                    + "<div style='max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;'>"
                    + "<h2 style='color: #b91c1c; margin-bottom: 12px;'>CarStore - Hóa đơn xác nhận thanh toán</h2>"
                    + "<p>Xin chào <strong>" + recipientName + "</strong>,</p>"
                    + "<p>Thanh toán đặt cọc / xác nhận giao dịch của bạn đã được xử lý thành công qua SePay.</p>"
                    + "<table style='width: 100%; border-collapse: collapse; margin-top: 16px;'>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700; width: 220px;'>Mã đơn hàng</td><td style='padding: 8px 0;'>#" + order.getId() + "</td></tr>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700;'>Mã hợp đồng</td><td style='padding: 8px 0;'>" + contractCode + "</td></tr>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700;'>Tài khoản đặt xe</td><td style='padding: 8px 0;'>" + (order.getUsername() != null ? order.getUsername() : "Chưa cung cấp") + "</td></tr>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700;'>Giá trị cọc / thanh toán</td><td style='padding: 8px 0;'>" + depositAmount + "</td></tr>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700;'>Mã giao dịch SePay</td><td style='padding: 8px 0;'>" + transactionNo + "</td></tr>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700;'>Ngày giờ giao dịch</td><td style='padding: 8px 0;'>" + paidAt + "</td></tr>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700;'>Người nhận</td><td style='padding: 8px 0;'>" + recipientName + "</td></tr>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700;'>Email</td><td style='padding: 8px 0;'>" + account.getEmail() + "</td></tr>"
                    + "<tr><td style='padding: 8px 0; font-weight: 700;'>Địa chỉ nhận xe</td><td style='padding: 8px 0;'>" + deliveryAddress + "</td></tr>"
                    + "</table>"
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
}
