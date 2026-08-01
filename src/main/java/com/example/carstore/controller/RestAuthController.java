package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.service.MailService;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.security.SecureRandom;
import java.util.Date;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestAuthController {
    private static final long EMAIL_VERIFICATION_TTL_MILLIS = 15 * 60 * 1000L;

    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public RestAuthController(AccountRepository accountRepo,
                              PasswordEncoder passwordEncoder,
                              MailService mailService) {
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Account account) {
        String validation = validateSignup(account);
        if (validation != null) {
            return ResponseUtils.fail(validation);
        }

        account.setRole("ROLE_USER");
        account.setEnabled(false);
        if (isBlank(account.getFullname())) {
            account.setFullname(account.getUsername());
        }
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        String verificationCode = generateCode();
        account.setVerificationCode(verificationCode);
        account.setVerificationExpired(new Date(System.currentTimeMillis() + EMAIL_VERIFICATION_TTL_MILLIS));

        Account saved = accountRepo.save(account);
        mailService.sendEmailVerificationCode(saved.getEmail(), verificationCode);
        return Map.of(
                "success", true,
                "message", "Tài khoản đã được tạo. Vui lòng kiểm tra email để xác thực.",
                "username", saved.getUsername(),
                "email", saved.getEmail(),
                "requiresVerification", true);
    }

    @PostMapping("/verify-email")
    public Map<String, Object> verifyEmail(@RequestBody Map<String, String> payload) {
        String username = payload == null ? null : payload.get("username");
        String code = payload == null ? null : payload.get("code");
        if (isBlank(username) || isBlank(code)) {
            return ResponseUtils.fail("Tên đăng nhập và mã xác thực là bắt buộc");
        }

        java.util.Optional<Account> accountOpt = accountRepo.findById(username.trim());
        if (accountOpt.isEmpty()) {
            return ResponseUtils.fail("Tài khoản hoặc mã xác thực không hợp lệ");
        }
        Account account = accountOpt.get();
        if (Boolean.TRUE.equals(account.getEnabled())) {
            return ResponseUtils.ok("Email đã được xác thực trước đó");
        }
        if (account.getVerificationCode() == null
                || account.getVerificationExpired() == null
                || new Date().after(account.getVerificationExpired())
                || !account.getVerificationCode().equals(code.trim())) {
            return ResponseUtils.fail("Mã xác thực không đúng hoặc đã hết hạn");
        }

        account.setEnabled(true);
        account.setVerificationCode(null);
        account.setVerificationExpired(null);
        accountRepo.save(account);
        return ResponseUtils.ok("Xác thực email thành công");
    }

    @PostMapping("/resend-verification")
    public Map<String, Object> resendVerification(@RequestBody Map<String, String> payload) {
        String username = payload == null ? null : payload.get("username");
        if (isBlank(username)) {
            return ResponseUtils.fail("Tên đăng nhập là bắt buộc");
        }

        java.util.Optional<Account> accountOpt = accountRepo.findById(username.trim());
        if (accountOpt.isEmpty()) {
            return ResponseUtils.fail("Không tìm thấy tài khoản");
        }
        Account account = accountOpt.get();
        if (Boolean.TRUE.equals(account.getEnabled())) {
            return ResponseUtils.ok("Email đã được xác thực trước đó");
        }
        if (account.getVerificationExpired() != null
                && account.getVerificationExpired().getTime() - System.currentTimeMillis()
                > EMAIL_VERIFICATION_TTL_MILLIS - 60_000L) {
            return ResponseUtils.fail("Vui lòng chờ 60 giây trước khi gửi lại mã");
        }

        String verificationCode = generateCode();
        account.setVerificationCode(verificationCode);
        account.setVerificationExpired(new Date(System.currentTimeMillis() + EMAIL_VERIFICATION_TTL_MILLIS));
        accountRepo.save(account);
        mailService.sendEmailVerificationCode(account.getEmail(), verificationCode);
        return ResponseUtils.ok("Mã xác thực mới đã được gửi đến email của bạn");
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
        if (!passwordEncoder.matches(password, account.getPassword())) {
            return ResponseUtils.fail("Sai tài khoản hoặc mật khẩu");
        }
        if (!Boolean.TRUE.equals(account.getEnabled())) {
            return Map.of(
                    "success", false,
                    "message", "Email chưa được xác thực",
                    "requiresVerification", true,
                    "username", account.getUsername());
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

    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(@RequestBody Map<String, String> payload,
                                              HttpSession session) {
        String email = payload == null ? null : payload.get("email");
        if (isBlank(email)) {
            return ResponseUtils.fail("Email is required");
        }

        java.util.Optional<Account> accountOpt = accountRepo.findByEmail(email.trim());
        if (accountOpt.isEmpty()) {
            return ResponseUtils.fail("Email không tồn tại trong hệ thống");
        }

        String otp = String.valueOf(100000 + secureRandom.nextInt(900000));
        session.setAttribute("resetEmail", accountOpt.get().getEmail());
        session.setAttribute("resetOtp", otp);
        session.setAttribute("resetOtpExpiresAt", System.currentTimeMillis() + 10 * 60 * 1000L);
        mailService.sendOtp(accountOpt.get().getEmail(), otp);
        return ResponseUtils.ok("Mã OTP đã được gửi đến email của bạn");
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> payload,
                                         HttpSession session) {
        String otp = payload == null ? null : payload.get("otp");
        String expectedOtp = (String) session.getAttribute("resetOtp");
        Long expiresAt = (Long) session.getAttribute("resetOtpExpiresAt");
        if (isBlank(otp) || expectedOtp == null || expiresAt == null
                || System.currentTimeMillis() > expiresAt || !expectedOtp.equals(otp.trim())) {
            return ResponseUtils.fail("Mã OTP không đúng hoặc đã hết hạn");
        }

        session.setAttribute("resetOtpVerified", Boolean.TRUE);
        session.removeAttribute("resetOtp");
        return ResponseUtils.ok("Xác thực OTP thành công");
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> payload,
                                             HttpSession session) {
        String password = payload == null ? null : payload.get("password");
        String confirmPassword = payload == null ? null : payload.get("confirmPassword");
        String email = (String) session.getAttribute("resetEmail");
        Boolean verified = (Boolean) session.getAttribute("resetOtpVerified");
        Long expiresAt = (Long) session.getAttribute("resetOtpExpiresAt");

        if (!Boolean.TRUE.equals(verified) || email == null || expiresAt == null
                || System.currentTimeMillis() > expiresAt) {
            return ResponseUtils.fail("Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
        }
        if (isBlank(password)) {
            return ResponseUtils.fail("Password is required");
        }
        if (password.length() < 6) {
            return ResponseUtils.fail("Mật khẩu phải có ít nhất 6 ký tự");
        }
        if (!password.equals(confirmPassword)) {
            return ResponseUtils.fail("Mật khẩu xác nhận không khớp");
        }

        java.util.Optional<Account> accountOpt = accountRepo.findByEmail(email);
        if (accountOpt.isEmpty()) {
            return ResponseUtils.fail("Không tìm thấy tài khoản");
        }

        Account account = accountOpt.get();
        account.setPassword(passwordEncoder.encode(password));
        accountRepo.save(account);
        session.removeAttribute("resetEmail");
        session.removeAttribute("resetOtpExpiresAt");
        session.removeAttribute("resetOtpVerified");
        return ResponseUtils.ok("Đổi mật khẩu thành công");
    }

    private String validateSignup(Account account) {
        if (account == null || isBlank(account.getUsername())) return "Username is required";
        account.setUsername(account.getUsername().trim());
        if (!account.getUsername().matches("^[a-zA-Z0-9._-]{3,50}$")) {
            return "Username phải có 3-50 ký tự và chỉ gồm chữ, số, dấu chấm, gạch dưới hoặc gạch ngang";
        }
        if (accountRepo.existsById(account.getUsername())) return "Username already exists";
        if (isBlank(account.getPassword())) return "Password is required";
        if (account.getPassword().length() < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        if (isBlank(account.getEmail())) return "Email is required";
        account.setEmail(account.getEmail().trim().toLowerCase());
        if (!account.getEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) return "Email không hợp lệ";
        if (accountRepo.findByEmail(account.getEmail()).isPresent()) return "Email đã được sử dụng";
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

    private String generateCode() {
        return String.valueOf(100000 + secureRandom.nextInt(900000));
    }
}
