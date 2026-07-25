package com.example.carstore.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationService {

    private final JavaMailSender mailSender;

    public EmailVerificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String email, String fullname, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);

        message.setSubject("CarStore - Xác thực tài khoản");

        message.setText(
                "Xin chào " + fullname + ",\n\n"
                        + "Cảm ơn bạn đã đăng ký tài khoản tại CarStore.\n\n"
                        + "Mã xác thực của bạn là:\n\n"
                        + otp
                        + "\n\nMã có hiệu lực trong 5 phút."
                        + "\n\nKhông chia sẻ mã này với bất kỳ ai."
                        + "\n\nCarStore Team"
        );

        mailSender.send(message);
    }
}