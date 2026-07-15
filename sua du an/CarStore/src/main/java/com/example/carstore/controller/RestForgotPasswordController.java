package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.service.MailService;
import com.example.carstore.util.ResponseUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class RestForgotPasswordController {

    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    public RestForgotPasswordController(AccountRepository accountRepo,
                                        PasswordEncoder passwordEncoder,
                                        MailService mailService) {
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    @PostMapping("/forgot-password")
    public Map<String, Object> sendOtp(@RequestBody Map<String, String> payload, HttpSession session) {
        String email = payload == null ? null : payload.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseUtils.fail("Email là bắt buộc");
        }

        Optional<Account> accountOpt = accountRepo.findByEmail(email.trim());
        if (accountOpt.isEmpty()) {
            return ResponseUtils.fail("Email không tồn tại trong hệ thống.");
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        session.setAttribute("resetEmail", email.trim());
        session.setAttribute("resetOtp", otp);
        mailService.sendOtp(email.trim(), otp);

        return Map.of("success", true, "message", "Mã OTP đã được gửi đến email của bạn.");
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> payload, HttpSession session) {
        String otp = payload == null ? null : payload.get("otp");
        String sessionOtp = (String) session.getAttribute("resetOtp");

        if (sessionOtp == null || otp == null || !sessionOtp.equals(otp)) {
            return ResponseUtils.fail("Mã OTP không đúng.");
        }

        session.setAttribute("otpVerified", true);
        return Map.of("success", true, "message", "Xác nhận OTP thành công");
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> payload, HttpSession session) {
        Boolean verified = (Boolean) session.getAttribute("otpVerified");
        if (verified == null || !verified) {
            return ResponseUtils.fail("Phiên đặt lại mật khẩu đã hết hạn.");
        }

        String email = (String) session.getAttribute("resetEmail");
        String password = payload == null ? null : payload.get("password");
        String confirmPassword = payload == null ? null : payload.get("confirmPassword");

        if (email == null) {
            return ResponseUtils.fail("Phiên đặt lại mật khẩu đã hết hạn.");
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseUtils.fail("Mật khẩu là bắt buộc");
        }
        if (!password.equals(confirmPassword)) {
            return ResponseUtils.fail("Mật khẩu xác nhận không khớp.");
        }

        Optional<Account> accountOpt = accountRepo.findByEmail(email);
        if (accountOpt.isEmpty()) {
            return ResponseUtils.fail("Không tìm thấy tài khoản.");
        }

        Account account = accountOpt.get();
        account.setPassword(passwordEncoder.encode(password));
        accountRepo.save(account);

        session.removeAttribute("resetEmail");
        session.removeAttribute("resetOtp");
        session.removeAttribute("otpVerified");

        return Map.of("success", true, "message", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
    }
}
