package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.CartItem;
import com.example.carstore.service.CarService;
import com.example.carstore.service.CartService;
import com.example.carstore.service.PromotionService;
import com.example.carstore.util.ResponseUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestCartController {

    private final CartService cartService;
    private final CarService carService;
    private final PromotionService promotionService;

    public RestCartController(CartService cartService, CarService carService,
                              PromotionService promotionService) {
        this.cartService = cartService;
        this.carService = carService;
        this.promotionService = promotionService;
    }

    @GetMapping
    public Map<String, Object> getCart(HttpSession session) {
        refreshCartItems(session);
        Collection<CartItem> items = cartService.getCart(session).values();
        return Map.of(
                "success", true,
                "items", items,
                "total", cartService.getTotal(session),
                "count", items.size());
    }

    @PostMapping("/add/{id}")
    public Map<String, Object> addToCart(@PathVariable int id,
                                         @RequestParam(defaultValue = "1") Integer quantity,
                                         HttpSession session) {
        java.util.Optional<Car> carOpt = carService.findById(id);
        if (carOpt.isEmpty()) {
            return ResponseUtils.fail("Car not found");
        }

        Car car = carOpt.get();
        if (!isAvailable(car)) {
            return ResponseUtils.fail("Xe " + car.getName() + " hiện không khả dụng.");
        }
        int safeQuantity = quantity == null || quantity < 1 ? 1 : quantity;

        CartItem existing = cartService.getCart(session).get(id);
        if (existing != null) {
            return ResponseUtils.fail("Xe này đã có trong phiếu đặt cọc xe của bạn.");
        }
        if (!cartService.getCart(session).isEmpty()) {
            return ResponseUtils.fail("Phiếu đặt cọc xe chỉ cho phép giữ chỗ một xe. Vui lòng xóa xe hiện tại trước.");
        }
        int currentQuantity = existing == null ? 0 : existing.getQuantity();
        int requestedQuantity = currentQuantity + safeQuantity;

        if (car.getStock() == null || requestedQuantity > car.getStock()) {
            return ResponseUtils.fail("Xe " + car.getName() + " không đủ tồn kho. Còn lại: " + car.getStock());
        }

        cartService.add(toCartItem(car, safeQuantity), session);
        refreshCartItems(session);
        return Map.of(
                "success", true,
                "message", "Added to cart",
                "carName", car.getName(),
                "quantity", safeQuantity,
                "items", cartService.getCart(session).values(),
                "total", cartService.getTotal(session));
    }

    @DeleteMapping("/remove/{id}")
    public Map<String, Object> removeFromCart(@PathVariable int id, HttpSession session) {
        cartService.remove(id, session);
        return Map.of(
                "success", true,
                "message", "Removed from cart",
                "items", cartService.getCart(session).values(),
                "total", cartService.getTotal(session));
    }

    @PutMapping("/update/{id}")
    public Map<String, Object> updateCartItem(@PathVariable int id,
                                              @RequestBody Map<String, Integer> payload,
                                              HttpSession session) {
        Integer quantity = payload == null ? null : payload.get("quantity");
        if (quantity == null || quantity < 1) {
            return ResponseUtils.fail("Invalid quantity");
        }

        CartItem item = cartService.getCart(session).get(id);
        if (item == null) {
            return ResponseUtils.fail("Item not in cart");
        }

        java.util.Optional<Car> carOpt = carService.findById(id);
        if (carOpt.isEmpty()) {
            return ResponseUtils.fail("Car not found");
        }
        Car car = carOpt.get();
        if (!isAvailable(car)) {
            return ResponseUtils.fail("Xe " + car.getName() + " hiện không khả dụng.");
        }
        if (quantity > 1) {
            return ResponseUtils.fail("Mỗi đơn đặt cọc chỉ được giữ chỗ một xe.");
        }
        if (car.getStock() == null || quantity > car.getStock()) {
            return ResponseUtils.fail("Xe " + car.getName() + " không đủ tồn kho. Còn lại: " + car.getStock());
        }

        item.setQuantity(quantity);
        return Map.of(
                "success", true,
                "message", "Cart item updated",
                "quantity", quantity,
                "items", cartService.getCart(session).values(),
                "total", cartService.getTotal(session));
    }

    @DeleteMapping("/clear")
    public Map<String, Object> clearCart(HttpSession session) {
        cartService.clear(session);
        return ResponseUtils.ok("Cart cleared");
    }

    @GetMapping("/stats")
    public Map<String, Object> getCartStats(HttpSession session) {
        Collection<CartItem> items = cartService.getCart(session).values();
        return Map.of(
                "success", true,
                "itemCount", items.size(),
                "totalQuantity", cartService.getTotalQuantity(session),
                "totalPrice", cartService.getTotal(session));
    }

    @GetMapping("/has/{id}")
    public Map<String, Object> hasItem(@PathVariable int id, HttpSession session) {
        CartItem item = cartService.getCart(session).get(id);
        if (item == null) {
            return Map.of("success", true, "has", false);
        }
        return Map.of("success", true, "has", true, "item", item);
    }

    @PostMapping("/increment/{id}")
    public Map<String, Object> incrementQuantity(@PathVariable int id, HttpSession session) {
        CartItem item = cartService.getCart(session).get(id);
        if (item == null) {
            return ResponseUtils.fail("Item not in cart");
        }

        if (item.getQuantity() >= 1) {
            return ResponseUtils.fail("Mỗi đơn đặt cọc chỉ được giữ chỗ một xe.");
        }
        java.util.Optional<Car> carOpt = carService.findById(id);
        if (carOpt.isEmpty()) {
            return ResponseUtils.fail("Car not found");
        }
        Car car = carOpt.get();
        if (!isAvailable(car)) {
            return ResponseUtils.fail("Xe " + car.getName() + " hiện không khả dụng.");
        }
        int newQuantity = item.getQuantity() + 1;
        if (car.getStock() == null || newQuantity > car.getStock()) {
            return ResponseUtils.fail("Xe " + car.getName() + " không đủ tồn kho. Còn lại: " + car.getStock());
        }

        item.setQuantity(newQuantity);
        return quantityResponse(item, session);
    }

    @PostMapping("/decrement/{id}")
    public Map<String, Object> decrementQuantity(@PathVariable int id, HttpSession session) {
        CartItem item = cartService.getCart(session).get(id);
        if (item == null) {
            return ResponseUtils.fail("Item not in cart");
        }
        cartService.decrease(id, session);
        return Map.of(
                "success", true,
                "quantity", cartService.getCart(session).containsKey(id)
                        ? cartService.getCart(session).get(id).getQuantity()
                        : 0,
                "items", cartService.getCart(session).values(),
                "total", cartService.getTotal(session));
    }

    private Map<String, Object> quantityResponse(CartItem item, HttpSession session) {
        return Map.of(
                "success", true,
                "quantity", item.getQuantity(),
                "items", cartService.getCart(session).values(),
                "total", cartService.getTotal(session));
    }

    private void refreshCartItems(HttpSession session) {
        Map<Integer, CartItem> cart = cartService.getCart(session);
        cart.entrySet().removeIf(entry -> carService.findById(entry.getKey())
                .map(car -> !isAvailable(car) || car.getStock() == null || car.getStock() <= 0)
                .orElse(true));
        cart.values().forEach(item ->
                carService.findById(item.getId()).ifPresent(car -> {
                    item.setName(car.getName());
                    double finalPrice = effectivePrice(car);
                    applyPricing(item, car.getPrice(), finalPrice);
                    item.setImage(car.getImageUrl());
                    item.setYear(car.getYear());
                    item.setBodyType(car.getBodyType());
                    item.setColor(car.getColor());
                    item.setStock(car.getStock());
                }));
    }

    private boolean isAvailable(Car car) {
        return car != null && "AVAILABLE".equalsIgnoreCase(car.getStatus());
    }

    private double effectivePrice(Car car) {
        return promotionService.priceAfterPromotion(car.getId(), car.getPrice());
    }

    private CartItem toCartItem(Car car, int quantity) {
        double finalPrice = effectivePrice(car);
        CartItem item = new CartItem(
                car.getId(), car.getName(), car.getPrice(), quantity,
                car.getImageUrl(), car.getYear(), car.getBodyType(), car.getColor(), car.getStock());
        applyPricing(item, car.getPrice(), finalPrice);
        return item;
    }

    private void applyPricing(CartItem item, double listPrice, double finalPrice) {
        double discountAmount = Math.max(0D, listPrice - finalPrice);
        item.setPrice(listPrice);
        item.setListPrice(listPrice);
        item.setDiscountAmount(discountAmount);
        item.setDiscountPercent(listPrice <= 0D ? 0D : discountAmount * 100D / listPrice);
        item.setFinalPrice(finalPrice);
        item.setDepositAmount(finalPrice * 0.10D);
    }
}
