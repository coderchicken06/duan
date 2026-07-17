package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping({ "/login", "/login/form" })
    public String login() {
        return "login";
    }

    @GetMapping("/signup")
    public String signupForm(Model model) {
        model.addAttribute("account", new Account());
        return "signup";
    }

    @PostMapping("/signup")
    public String signupSubmit(Account account, Model model) {
        String validation = validateSignup(account);
        if (validation != null) {
            model.addAttribute("error", validation);
            model.addAttribute("account", account);
            return "signup";
        }

        if (!hasText(account.getFullname())) {
            account.setFullname(account.getUsername());
        }

        account.setPassword(passwordEncoder.encode(account.getPassword().trim()));
        account.setRole("ROLE_USER");
        accountRepository.save(account);
        return "redirect:/login?registered";
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String validateSignup(Account account) {
        if (account == null) {
            return "Vui lòng điền đầy đủ thông tin.";
        }
        if (!hasText(account.getUsername()))
            return "Username là bắt buộc.";
        if (!hasText(account.getPassword()))
            return "Password là bắt buộc.";
        if (account.getPassword().trim().length() < 6)
            return "Mật khẩu phải ít nhất 6 ký tự.";
        if (!hasText(account.getEmail()))
            return "Email là bắt buộc.";
        if (!account.getEmail().contains("@"))
            return "Email không hợp lệ.";
        if (accountRepository.existsById(account.getUsername().trim()))
            return "Tài khoản đã tồn tại.";
        return null;
    }
}
