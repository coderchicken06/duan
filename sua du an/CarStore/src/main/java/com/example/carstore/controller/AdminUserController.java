package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.OrderRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/users")
public class AdminUserController {

    private final AccountRepository accountRepo;
    private final OrderRepository orderRepo;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(AccountRepository accountRepo,
                               OrderRepository orderRepo,
                               PasswordEncoder passwordEncoder) {
        this.accountRepo = accountRepo;
        this.orderRepo = orderRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", accountRepo.findAll());
        return "admin-users";
    }

    @GetMapping("/edit/{username}")
    public String editUser(@PathVariable String username, Model model) {
        Account account = accountRepo.findById(username).orElse(new Account());
        // Không đổ password đã mã hóa ra form. Nếu để trống khi lưu thì giữ password cũ.
        account.setPassword("");
        model.addAttribute("account", account);
        return "admin-user-form";
    }

    @PostMapping("/save")
    public String saveUser(Account account, RedirectAttributes ra) {
        String validation = validateUser(account);
        if (validation != null) {
            ra.addFlashAttribute("error", validation);
            ra.addFlashAttribute("account", account);
            return "redirect:/admin/users/edit/" + (account.getUsername() != null ? account.getUsername() : "");
        }

        boolean existed = accountRepo.existsById(account.getUsername());
        Account entity = existed ? accountRepo.findById(account.getUsername()).orElse(new Account()) : new Account();

        entity.setUsername(account.getUsername().trim());
        entity.setFullname(hasText(account.getFullname()) ? account.getFullname().trim() : account.getUsername().trim());
        entity.setEmail(account.getEmail().trim());
        entity.setRole(hasText(account.getRole()) ? account.getRole().trim() : "ROLE_USER");

        if (hasText(account.getPassword())) {
            entity.setPassword(passwordEncoder.encode(account.getPassword().trim()));
        } else if (!existed) {
            ra.addFlashAttribute("error", "Mật khẩu không được để trống khi tạo user mới.");
            ra.addFlashAttribute("account", account);
            return "redirect:/admin/users/edit/" + account.getUsername();
        }

        accountRepo.save(entity);
        ra.addFlashAttribute("success", "Đã lưu user thành công.");
        return "redirect:/admin/users";
    }

    private String validateUser(Account account) {
        if (account == null) {
            return "Dữ liệu người dùng không hợp lệ.";
        }
        if (!hasText(account.getUsername())) {
            return "Username không được để trống.";
        }
        if (!hasText(account.getEmail())) {
            return "Email không được để trống.";
        }
        if (!account.getUsername().matches("^[a-zA-Z0-9._-]{3,20}$")) {
            return "Username chỉ chấp nhận ký tự chữ, số, dấu . _ -, độ dài 3-20.";
        }
        if (!hasText(account.getPassword()) && !accountRepo.existsById(account.getUsername())) {
            return "Mật khẩu không được để trống khi tạo user mới.";
        }
        return null;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    @GetMapping("/delete/{username}")
    public String deleteUser(@PathVariable String username, RedirectAttributes ra) {
        if (orderRepo.existsByUsername(username)) {
            ra.addFlashAttribute("error", "Không thể xóa user vì user này đã có đơn hàng. Hãy giữ lại để bảo toàn lịch sử đơn hàng.");
            return "redirect:/admin/users";
        }

        accountRepo.deleteById(username);
        ra.addFlashAttribute("success", "Đã xóa user thành công.");
        return "redirect:/admin/users";
    }
}
