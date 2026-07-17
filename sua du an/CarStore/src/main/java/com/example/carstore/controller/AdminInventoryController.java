package com.example.carstore.controller;

import com.example.carstore.service.CarService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminInventoryController {

    private final CarService carService;

    public AdminInventoryController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("/admin/inventory")
    public String inventory(Model model) {
        model.addAttribute("list", carService.findAll());
        return "admin-inventory";
    }
}