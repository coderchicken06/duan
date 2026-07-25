package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.CartItem;
import com.example.carstore.service.CarService;
import com.example.carstore.service.CartService;
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

    public RestCartController(CartService cartService, CarService carService) {
        this.cartService = cartService;
        this.carService = carService;
    }

    @GetMapping
    public Map<String, Object> getCart(HttpSession session) {
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
        int safeQuantity = quantity == null || quantity < 1 ? 1 : quantity;

        CartItem existing = cartService.getCart(session).get(id);
        int currentQuantity = existing == null ? 0 : existing.getQuantity();
        int requestedQuantity = currentQuantity + safeQuantity;

        if (car.getStock() == null || requestedQuantity > car.getStock()) {
            return ResponseUtils.fail("Xe " + car.getName() + " không đủ tồn kho. Còn lại: " + car.getStock());
        }

        cartService.add(new CartItem(car.getId(), car.getName(), car.getPrice(), safeQuantity), session);
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

        java.util.Optional<Car> carOpt = carService.findById(id);
        if (carOpt.isEmpty()) {
            return ResponseUtils.fail("Car not found");
        }
        Car car = carOpt.get();
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
}
