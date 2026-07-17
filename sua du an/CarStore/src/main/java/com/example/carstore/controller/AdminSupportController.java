package com.example.carstore.controller;

import com.example.carstore.repository.SupportRequestRepository;
import com.example.carstore.service.SupportRequestService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/support")
public class AdminSupportController {

    private final SupportRequestRepository supportRepo;
    private final SupportRequestService supportService;

    public AdminSupportController(SupportRequestRepository supportRepo,
            SupportRequestService supportService) {
        this.supportRepo = supportRepo;
        this.supportService = supportService;
    }

    @GetMapping
    public String listSupport(Model model,
            @RequestParam(required = false) String type) {

        if (type != null && !type.trim().isEmpty()) {
            model.addAttribute("list", supportRepo.findByTypeIgnoreCase(type));
        } else {
            model.addAttribute("list", supportRepo.findAll());
        }

        model.addAttribute("type", type);
        model.addAttribute("isAdmin", true);
        return "admin-support";
    }

    @GetMapping("/done/{id}")
    public String done(@PathVariable int id) {
        supportService.markDone(id);
        return "redirect:/admin/support";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable int id) {
        if (supportRepo.existsById(id)) {
            supportRepo.deleteById(id);
        }
        return "redirect:/admin/support";
    }
}