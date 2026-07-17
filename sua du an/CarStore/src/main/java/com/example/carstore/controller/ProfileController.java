package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.SupportRequestRepository;
import com.example.carstore.util.SecurityUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Collections;
import java.util.Optional;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    private final AccountRepository accountRepo;
    private final PasswordEncoder passwordEncoder;
    private final SupportRequestRepository supportRepo;

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

    public ProfileController(AccountRepository accountRepo,
            PasswordEncoder passwordEncoder,
            SupportRequestRepository supportRepo) {
        this.accountRepo = accountRepo;
        this.passwordEncoder = passwordEncoder;
        this.supportRepo = supportRepo;
    }

    @GetMapping
    public String profile(Authentication auth, Model model) {
        if (auth == null || !auth.isAuthenticated()) {
            return "redirect:/login";
        }

        java.util.Optional<Account> acctOpt = getCurrentAccount(auth);
        if (acctOpt.isEmpty()) {
            model.addAttribute("error", "Không tìm thấy tài khoản: " + auth.getName());
            model.addAttribute("account", emptyAccount(auth.getName()));
            model.addAttribute("list", Collections.emptyList());
            return "profile";
        }
        Account account = acctOpt.get();
        loadModel(auth, model, account);
        return "profile";
    }

    @PostMapping("/update")
    public String update(Account form, Authentication auth, Model model) {
        if (auth == null || !auth.isAuthenticated()) {
            return "redirect:/login";
        }

        java.util.Optional<Account> acctOpt = getCurrentAccount(auth);
        if (acctOpt.isEmpty()) {
            model.addAttribute("error", "Không tìm thấy tài khoản: " + auth.getName());
            model.addAttribute("account", emptyAccount(auth.getName()));
            model.addAttribute("list", Collections.emptyList());
            return "profile";
        }
        Account account = acctOpt.get();

        account.setFullname(form.getFullname());
        account.setEmail(form.getEmail());

        if (form.getPassword() != null && !form.getPassword().trim().isEmpty()) {
            account.setPassword(passwordEncoder.encode(form.getPassword()));
        }

        accountRepo.save(account);

        model.addAttribute("success", "Cập nhật thành công!");
        loadModel(auth, model, account);
        return "profile";
    }

    private void loadModel(Authentication auth, Model model, Account account) {
        model.addAttribute("account", account);
    }

    private Account emptyAccount(String username) {
        Account account = new Account();
        account.setUsername(username);
        account.setFullname("");
        account.setEmail("");
        account.setPassword("");
        account.setRole("ROLE_USER");
        return account;
    }
}