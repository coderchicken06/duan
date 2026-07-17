package com.example.carstore.controller;

import com.example.carstore.service.SupportRequestService;
import com.example.carstore.util.SecurityUtils;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ServiceController {

    private final SupportRequestService supportService;

    public ServiceController(SupportRequestService supportService) {
        this.supportService = supportService;
    }

    @GetMapping("/service/book")
    public String serviceBook() {
        return "redirect:/service";
    }

    @GetMapping("/service")
    public String service() {
        return "service";
    }

    @GetMapping("/support")
    public String support(@RequestParam(defaultValue = "chat") String type, Model model) {
        model.addAttribute("type", type);
        return "support";
    }

    @PostMapping("/service/book")
    public String handleServiceBook(@RequestParam String name,
                                    @RequestParam String phone,
                                    @RequestParam String carInfo,
                                    @RequestParam String serviceType,
                                    @RequestParam String date,
                                    @RequestParam String time,
                                    Authentication auth,
                                    Model model) {
        if (!SecurityUtils.isLoggedIn(auth)) {
            return "redirect:/login";
        }

        if (!hasText(name) || !hasText(phone) || !hasText(carInfo) || !hasText(serviceType)
                || !hasText(date) || !hasText(time)) {
            model.addAttribute("error", "Vui lòng điền đầy đủ thông tin.");
            model.addAttribute("type", "service");
            return "service";
        }

        try {
            supportService.createServiceBooking(name, phone, carInfo, serviceType, date, time, auth);
            model.addAttribute("message", "Đặt lịch dịch vụ thành công!");
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
            model.addAttribute("type", "service");
        }
        return "service";
    }

    @PostMapping("/support")
    public String handleSupport(@RequestParam String name,
                                @RequestParam String phone,
                                @RequestParam String content,
                                @RequestParam(defaultValue = "chat") String type,
                                Authentication auth,
                                Model model) {
        if (!SecurityUtils.isLoggedIn(auth)) {
            return "redirect:/login";
        }

        if (!hasText(name) || !hasText(phone) || !hasText(content)) {
            model.addAttribute("error", "Vui lòng điền đầy đủ thông tin.");
            model.addAttribute("type", type);
            return "support";
        }

        try {
            supportService.createSupport(name, phone, type, content, auth);
            model.addAttribute("message", "Gửi thành công!");
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
        }
        model.addAttribute("type", type);
        return "support";
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    @GetMapping("/history")
    public String history(@RequestParam(required = false) String type,
                          Authentication auth,
                          Model model) {
        if (!SecurityUtils.isLoggedIn(auth)) {
            return "redirect:/login";
        }

        model.addAttribute("list", supportService.findHistory(type, auth));
        model.addAttribute("isAdmin", SecurityUtils.isAdmin(auth));
        return "history";
    }

    @GetMapping("/done/{id}")
    public String done(@PathVariable int id, Authentication auth) {
        if (SecurityUtils.isAdmin(auth)) {
            supportService.markDone(id);
        }
        return "redirect:/history";
    }
}
