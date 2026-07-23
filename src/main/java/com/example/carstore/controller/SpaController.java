package com.example.carstore.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Chuyển các URL của Vue Router về index.html khi chạy bản production.
 * Controller này không render Thymeleaf và không chứa logic nghiệp vụ.
 */
@Controller
public class SpaController {

    @GetMapping({
            "/login", "/signup", "/forgot-password", "/verify-otp", "/reset-password",
            "/profile", "/history", "/service", "/support", "/checkout", "/compare",
            "/car/list", "/car/create", "/car/detail/{id}", "/car/edit/{id}",
            "/cart/view", "/order/my-orders", "/order/detail/{id}",
            "/admin/dashboard", "/admin/inventory", "/admin/orders", "/admin/support",
            "/admin/users", "/admin/users/create", "/admin/users/edit/{username}"
    })
    public String forwardToVue() {
        return "forward:/index.html";
    }
}
