package com.example.carstore.controller;

import com.example.carstore.entity.Brand;
import com.example.carstore.repository.BrandRepository;
import com.example.carstore.util.ResponseUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestBrandController {

    private final BrandRepository brandRepo;

    public RestBrandController(BrandRepository brandRepo) {
        this.brandRepo = brandRepo;
    }

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandRepo.findAll();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getBrandById(@PathVariable int id) {
        return brandRepo.findById(id)
                .map(brand -> Map.<String, Object>of("success", true, "data", brand))
                .orElse(ResponseUtils.fail("Brand not found"));
    }

}
