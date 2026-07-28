package com.example.carstore.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
}
