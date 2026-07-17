package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.service.MailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Optional;
import java.util.Random;

@Controller
public class ForgotPasswordController {

    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    public ForgotPasswordController(AccountRepository accountRepo,
                                    PasswordEncoder passwordEncoder,
                                    MailService mailService) {
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    @GetMapping("/forgot-password")
    public String forgotPasswordForm() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String sendOtp(@RequestParam String email,
                          HttpSession session,
                          Model model) {

        Optional<Account> accountOpt = accountRepo.findByEmail(email);

        if (accountOpt.isEmpty()) {
            model.addAttribute("error", "Email không tồn tại trong hệ thống.");
            return "forgot-password";
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        session.setAttribute("resetEmail", email);
        session.setAttribute("resetOtp", otp);

        mailService.sendOtp(email, otp);

        model.addAttribute("message", "Mã OTP đã được gửi đến email của bạn.");
        return "verify-otp";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String otp,
                            HttpSession session,
                            Model model) {

        String sessionOtp = (String) session.getAttribute("resetOtp");

        if (sessionOtp == null || !sessionOtp.equals(otp)) {
            model.addAttribute("error", "Mã OTP không đúng.");
            return "verify-otp";
        }

        return "reset-password";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String password,
                                @RequestParam String confirmPassword,
                                HttpSession session,
                                Model model) {

        String email = (String) session.getAttribute("resetEmail");

        if (email == null) {
            model.addAttribute("error", "Phiên đặt lại mật khẩu đã hết hạn.");
            return "forgot-password";
        }

        if (!password.equals(confirmPassword)) {
            model.addAttribute("error", "Mật khẩu xác nhận không khớp.");
            return "reset-password";
        }

        Optional<Account> accountOpt = accountRepo.findByEmail(email);

        if (accountOpt.isEmpty()) {
            model.addAttribute("error", "Không tìm thấy tài khoản.");
            return "forgot-password";
        }

        Account account = accountOpt.get();
        account.setPassword(passwordEncoder.encode(password));
        accountRepo.save(account);

        session.removeAttribute("resetEmail");
        session.removeAttribute("resetOtp");

        model.addAttribute("success", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
        return "redirect:/login/form?resetSuccess";
    }
}