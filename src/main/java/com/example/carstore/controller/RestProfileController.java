package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.util.ResponseUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestProfileController {

    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;

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

    public RestProfileController(AccountRepository accountRepo, PasswordEncoder passwordEncoder) {
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
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
    public Map<String, Object> updateProfile(@RequestBody Account account, Authentication auth) {
        if (auth == null) {
            return ResponseUtils.fail("Not authenticated");
        }

        java.util.Optional<Account> existingOpt = getCurrentAccount(auth);
        if (existingOpt.isEmpty())
            return ResponseUtils.fail("Account not found");
        Account existing = existingOpt.get();

        if (hasText(account.getFullname()))
            existing.setFullname(account.getFullname());
        if (hasText(account.getEmail()))
            existing.setEmail(account.getEmail());
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

    @DeleteMapping
    public Map<String, Object> deleteAccount(Authentication auth) {
        if (auth == null) {
            return ResponseUtils.fail("Not authenticated");
        }
        Optional<Account> accountOpt = getCurrentAccount(auth);

        if (accountOpt.isEmpty()) {
            return ResponseUtils.fail("Account not found");
        }
        accountRepo.delete(accountOpt.get());
        return ResponseUtils.ok("Account deleted successfully");
    }

    @GetMapping("/{username}")
    public Map<String, Object> getProfileByUsername(@PathVariable String username) {
        return profileResponse(username);
    }

    @PostMapping("/verify-password")
    public Map<String, Object> verifyPassword(@RequestBody Map<String, String> payload, Authentication auth) {
        if (auth == null) {
            return ResponseUtils.fail("Not authenticated");
        }

        String password = payload == null ? null : payload.get("password");
        if (!hasText(password)) {
            return ResponseUtils.fail("Password is required");
        }

        java.util.Optional<Account> accountOpt = getCurrentAccount(auth);
        if (accountOpt.isEmpty())
            return ResponseUtils.fail("Account not found");
        Account account = accountOpt.get();
        return Map.of("success", true, "matches", passwordEncoder.matches(password, account.getPassword()));
    }

    private Map<String, Object> profileResponse(String username) {

        Optional<Account> accountOpt = accountRepo.findByUsername(username);

        if (accountOpt.isEmpty()) {
            accountOpt = accountRepo.findByEmail(username);
        }

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

    private String validatePassword(String oldPassword, String newPassword, String confirmPassword) {
        if (!hasText(oldPassword))
            return "Old password is required";
        if (!hasText(newPassword))
            return "New password is required";
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
