package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.util.ResponseUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.example.carstore.service.EmailVerificationService;
import com.example.carstore.service.OtpService;
import com.example.carstore.dto.VerifyOtpRequest;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestAuthController {

    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final OtpService otpService;

    public RestAuthController(
        AccountRepository accountRepo,
        PasswordEncoder passwordEncoder,
        // code ma xac thucthuc
        EmailVerificationService emailVerificationService,
        OtpService otpService) {

    this.accountRepo = accountRepo;
    this.passwordEncoder = passwordEncoder;
    this.emailVerificationService = emailVerificationService;
    this.otpService = otpService;
}

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Account account) {
        String validation = validateSignup(account);
        if(accountRepo.findByEmail(account.getEmail()).isPresent()){
            return ResponseUtils.fail("Email đã tồn tại");
        }
        if (validation != null) {
            return ResponseUtils.fail(validation);
        }
        account.setRole("ROLE_USER");

        if ("ROLE_ADMIN".equals(account.getRole())) {
        
            account.setEnabled(true);
        
        } else {
        
            account.setEnabled(false);
        
            String otp = otpService.generateOtp();
        
            account.setVerificationCode(otp);
        
            account.setVerificationExpired(
                otpService.expiredTime()
            );
        }
        
                // Mã hóa mật khẩu
                account.setPassword(passwordEncoder.encode(account.getPassword()));
                
                // Lưu tài khoản
                Account saved = accountRepo.save(account);
                
                // Nếu là USER thì gửi OTP
                if (!"ROLE_ADMIN".equals(saved.getRole())) {
                
                    emailVerificationService.sendVerificationEmail(
                        saved.getEmail(),
                        saved.getFullname(),
                        saved.getVerificationCode()
                    );
                }
                
                return Map.of(
                    "success", true,
                    "message", "Đăng ký thành công. Vui lòng kiểm tra Gmail để lấy mã OTP.",
                    "username", saved.getUsername()
                );
    }
// code xac thuc tai khoankhoan
    @PostMapping("/verify")
        public Map<String, Object> verify(@RequestBody VerifyOtpRequest request) {

            Account account = accountRepo.findByEmail(request.getEmail())
                    .orElse(null);

            if (account == null) {
                return ResponseUtils.fail("Email không tồn tại");
            }

            if (account.getVerificationCode() == null) {
                return ResponseUtils.fail("Không tìm thấy mã xác thực");
            }

            if (!account.getVerificationCode().equals(request.getOtp())) {
                return ResponseUtils.fail("Mã OTP không đúng");
            }

            if (otpService.isExpired(account.getVerificationExpired())) {
                return ResponseUtils.fail("Mã OTP đã hết hạn");
            }

            account.setEnabled(true);
            account.setVerificationCode(null);
            account.setVerificationExpired(null);

            accountRepo.save(account);

            return ResponseUtils.ok("Xác thực tài khoản thành công");
        }



        @PostMapping("/resend-otp")
        public Map<String, Object> resendOtp(@RequestBody Map<String, String> request) {

            String email = request.get("email");

            Optional<Account> accountOpt = accountRepo.findByEmail(email);

            if (accountOpt.isEmpty()) {
                return ResponseUtils.fail("Email không tồn tại");
            }

            Account account = accountOpt.get();

            String otp = otpService.generateOtp();

                account.setVerificationCode(otp);
                account.setVerificationExpired(otpService.expiredTime());

                accountRepo.save(account);

                emailVerificationService.sendVerificationEmail(
                        account.getEmail(),
                        account.getFullname(),
                        otp
                );

            return ResponseUtils.ok("Đã gửi lại mã OTP");
        }



    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials,
                                     HttpServletRequest request) {
        String username = credentials == null ? null : credentials.get("username");
        String password = credentials == null ? null : credentials.get("password");

        if (isBlank(username)) {
            return ResponseUtils.fail("Username is required");
        }
        if (isBlank(password)) {
            return ResponseUtils.fail("Password is required");
        }

        java.util.Optional<Account> accountOpt = accountRepo.findById(username);
        if (accountOpt.isEmpty()) return ResponseUtils.fail("Sai tài khoản hoặc mật khẩu");
        Account account = accountOpt.get();
            // Admin không cần xác thực email
        if (!"ROLE_ADMIN".equals(account.getRole())
            && !Boolean.TRUE.equals(account.getEnabled())) {

        return ResponseUtils.fail(
            "Tài khoản chưa xác thực email. Vui lòng kiểm tra Gmail để nhập mã OTP."
        );
        }
        if (!passwordEncoder.matches(password, account.getPassword())) {
            return ResponseUtils.fail("Sai tài khoản hoặc mật khẩu");
        }

        saveLoginSession(account, request);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Đăng nhập thành công");
        result.put("username", account.getUsername());
        result.put("fullname", account.getFullname());
        result.put("email", account.getEmail());
        result.put("role", account.getRole());
        return result;
    }

    @GetMapping("/validate")
    public Map<String, Object> validateToken(@RequestParam String username) {
        java.util.Optional<Account> accountOpt = accountRepo.findById(username);
        if (accountOpt.isEmpty()) return ResponseUtils.fail("User not found");
        Account account = accountOpt.get();
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("username", account.getUsername());
        result.put("fullname", account.getFullname());
        result.put("role", account.getRole());
        return result;
    }

    @GetMapping("/check-username/{username}")
    public Map<String, Object> checkUsernameAvailability(@PathVariable String username) {
        return Map.of("available", !accountRepo.existsById(username), "username", username);
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseUtils.fail("Not authenticated");
        }

        java.util.Optional<Account> accountOpt = accountRepo.findById(auth.getName());
        if (accountOpt.isEmpty()) {
            accountOpt = accountRepo.findByEmail(auth.getName());
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

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseUtils.ok("Logged out successfully");
    }

    private String validateSignup(Account account) {
        if (account == null || isBlank(account.getUsername()))
            return "Username is required";
    
        if (accountRepo.existsById(account.getUsername()))
            return "Username already exists";
    
        if (isBlank(account.getPassword()))
            return "Password is required";
    
        if (isBlank(account.getEmail()))
            return "Email is required";
    
        //  đoạn này mới thêm 
        if (accountRepo.findByEmail(account.getEmail()).isPresent())
            return "Email already exists";
    
        return null;
    }
    private void saveLoginSession(Account account, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                account.getUsername(),
                null,
                List.of(new SimpleGrantedAuthority(account.getRole())));

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        request.getSession(true).setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                context);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
