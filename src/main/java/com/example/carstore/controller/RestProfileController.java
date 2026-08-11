package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.service.MailService;
import com.example.carstore.util.ResponseUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Date;
import java.security.SecureRandom;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestProfileController {

    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final SecureRandom secureRandom = new SecureRandom();

    private Optional<Account> getCurrentAccount(Authentication auth) {
        if (auth == null) {
            return Optional.empty();
        }

        Optional<Account> account = accountRepo.findByUsername(auth.getName());

        if (account.isPresent()) {
            return account;
        }

        return accountRepo.findByEmail(auth.getName());
    }

    public RestProfileController(AccountRepository accountRepo, PasswordEncoder passwordEncoder,
            MailService mailService) {
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    @GetMapping
    public Map<String, Object> getProfile(Authentication auth) {

        if (auth == null) {
            return ResponseUtils.fail("Not authenticated");
        }

        Optional<Account> accountOpt = getCurrentAccount(auth);

        if (accountOpt.isEmpty()) {
            return ResponseUtils.fail("Account not found");
        }

        Account account = accountOpt.get();

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("username", account.getUsername());
        result.put("fullname", account.getFullname());
        result.put("email", account.getEmail());
        result.put("role", account.getRole());

        return result;
    }

    @PutMapping
    public Map<String, Object> updateProfile(@RequestBody Account account, Authentication auth,
            HttpServletRequest request) {
        if (auth == null) {
            return ResponseUtils.fail("Not authenticated");
        }

        java.util.Optional<Account> existingOpt = getCurrentAccount(auth);
        if (existingOpt.isEmpty())
            return ResponseUtils.fail("Account not found");
        Account existing = existingOpt.get();

        if (hasText(account.getFullname()))
            existing.setFullname(account.getFullname());
        boolean emailChanged = false;
        if (hasText(account.getEmail())) {
            String email = account.getEmail().trim().toLowerCase();
            if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                return ResponseUtils.fail("Email không hợp lệ");
            }
            Optional<Account> emailOwner = accountRepo.findByEmail(email);
            if (emailOwner.isPresent() && !emailOwner.get().getUsername().equals(existing.getUsername())) {
                return ResponseUtils.fail("Email đã được sử dụng");
            }
            emailChanged = !email.equalsIgnoreCase(existing.getEmail());
            existing.setEmail(email);
        }
        if (emailChanged) {
            String code = String.valueOf(100000 + secureRandom.nextInt(900000));
            Date expiresAt = new Date(System.currentTimeMillis() + 15 * 60 * 1000L);
            mailService.sendEmailVerificationCode(existing.getEmail(), code);
            existing.setEnabled(false);
            existing.setVerificationCode(code);
            existing.setVerificationExpired(expiresAt);
            accountRepo.save(existing);
            SecurityContextHolder.clearContext();
            HttpSession session = request.getSession(false);
            if (session != null) session.invalidate();
            return Map.of(
                    "success", true,
                    "message", "Email đã thay đổi. Vui lòng xác thực địa chỉ email mới.",
                    "requiresVerification", true,
                    "username", existing.getUsername(),
                    "email", existing.getEmail());
        }
        accountRepo.save(existing);
        return ResponseUtils.ok("Profile updated successfully");
    }

    @PostMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody Map<String, String> payload, Authentication auth) {
        if (auth == null) {
            return ResponseUtils.fail("Not authenticated");
        }

        String oldPassword = payload == null ? null : payload.get("oldPassword");
        String newPassword = payload == null ? null : payload.get("newPassword");
        String confirmPassword = payload == null ? null : payload.get("confirmPassword");
        String validation = validatePassword(oldPassword, newPassword, confirmPassword);
        if (validation != null) {
            return ResponseUtils.fail(validation);
        }

        java.util.Optional<Account> accountOpt = getCurrentAccount(auth);
        if (accountOpt.isEmpty())
            return ResponseUtils.fail("Account not found");
        Account account = accountOpt.get();
        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            return ResponseUtils.fail("Old password is incorrect");
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepo.save(account);
        return ResponseUtils.ok("Password changed successfully");
    }

    private String validatePassword(String oldPassword, String newPassword, String confirmPassword) {
        if (!hasText(oldPassword))
            return "Old password is required";
        if (!hasText(newPassword))
            return "New password is required";
        if (newPassword.length() < 6)
            return "Mật khẩu phải có ít nhất 6 ký tự";
        if (!newPassword.equals(confirmPassword))
            return "Passwords do not match";
        if (newPassword.equals(oldPassword))
            return "New password must be different from old password";
        return null;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
