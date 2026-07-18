package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.service.CarService;
import com.example.carstore.service.FileStorageService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/car")
public class CarController {

    private final CarService carService;
    private final FileStorageService fileStorageService;

    public CarController(CarService carService, FileStorageService fileStorageService) {
        this.carService = carService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/list")
    public String list(Model model) {
        model.addAttribute("list", carService.findAll());
        return "car-list";
    }

    @GetMapping("/create")
    public String create(Model model) {
        Car car = new Car();
        car.setStock(0);
        model.addAttribute("car", car);
        return "car-form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Car car,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Model model) {

        normalizeCar(car);

        String validation = validateCar(car);
        if (validation != null) {
            model.addAttribute("error", validation);
            model.addAttribute("car", car);
            return "car-form";
        }

        try {
            saveImageIfPresent(car, file);
            keepOldImageWhenEditing(car);
            carService.save(car);
            return "redirect:/car/list";
        } catch (Exception ex) {
            Throwable root = ex;
            while (root.getCause() != null) {
                root = root.getCause();
            }

            model.addAttribute("error", root.getClass().getName() + "<br>" + root.getMessage());
            model.addAttribute("car", car);
            return "car-form";
        }
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable int id, Model model) {
        java.util.Optional<Car> carOpt = carService.findById(id);
        if (carOpt.isEmpty()) {
            return "redirect:/car/list";
        }

        Car car = carOpt.get();
        normalizeCar(car);
        model.addAttribute("car", car);
        return "car-form";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable int id) {
        carService.delete(id);
        return "redirect:/car/list";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable int id, Model model) {
        java.util.Optional<Car> carOpt = carService.findById(id);
        if (carOpt.isEmpty()) {
            return "redirect:/car/list";
        }
        model.addAttribute("car", carOpt.get());
        model.addAttribute("similarCars", carService.findSimilar(carOpt.get()));
        model.addAttribute("comparisonCars", carService.findAll().stream()
                .filter(item -> !item.getId().equals(id))
                .collect(java.util.stream.Collectors.toList()));
        return "car-detail";
    }

    private void saveImageIfPresent(Car car, MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            return;
        }

        String filename = fileStorageService.saveImage(file);
        if (hasText(filename)) {
            car.setImage(filename);
        }
    }

    private void keepOldImageWhenEditing(Car car) {
        if (car.getId() == null || hasText(car.getImage())) {
            return;
        }
        java.util.Optional<Car> existingOpt = carService.findById(car.getId());
        if (existingOpt.isPresent() && hasText(existingOpt.get().getImage())) {
            car.setImage(existingOpt.get().getImage());
        }
    }

    private void normalizeCar(Car car) {
        if (car != null && car.getStock() == null) {
            car.setStock(0);
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String validateCar(Car car) {
        if (car == null) {
            return "Xe không hợp lệ.";
        }
        if (!hasText(car.getName())) {
            return "Tên xe không được để trống.";
        }
        if (car.getPrice() == null || car.getPrice() <= 0) {
            return "Giá xe phải lớn hơn 0.";
        }
        if (car.getBrandId() == null || car.getBrandId() <= 0) {
            return "Hãng xe không hợp lệ.";
        }
        if (car.getStock() == null || car.getStock() < 0) {
            return "Số lượng tồn kho không hợp lệ.";
        }
        return null;
    }
}
