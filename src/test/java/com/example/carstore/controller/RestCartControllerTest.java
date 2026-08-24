package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.CartItem;
import com.example.carstore.service.CarService;
import com.example.carstore.service.CartService;
import com.example.carstore.service.PromotionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RestCartControllerTest {
    private final CartService cartService = new CartService();
    private final CarService carService = mock(CarService.class);
    private final PromotionService promotionService = mock(PromotionService.class);
    private RestCartController controller;

    @BeforeEach
    void setUp() {
        controller = new RestCartController(cartService, carService, promotionService);
    }

    @Test
    void getCartExposesListAndPromotionalPricesSeparately() {
        Car car = new Car();
        car.setId(7);
        car.setName("BMW X5");
        car.setPrice(1_000_000_000D);
        car.setStock(2);
        car.setStatus("AVAILABLE");

        MockHttpSession session = new MockHttpSession();
        cartService.add(new CartItem(7, "BMW X5", car.getPrice(), 1), session);
        when(carService.findById(7)).thenReturn(Optional.of(car));
        when(promotionService.priceAfterPromotion(7, car.getPrice())).thenReturn(900_000_000D);

        Map<String, Object> response = controller.getCart(session);

        CartItem item = cartService.getCart(session).get(7);
        assertEquals(1_000_000_000D, item.getPrice());
        assertEquals(100_000_000D, item.getDiscountAmount());
        assertEquals(10D, item.getDiscountPercent());
        assertEquals(900_000_000D, item.getFinalPrice());
        assertEquals(90_000_000D, item.getDepositAmount());
        assertEquals(900_000_000D, (double) response.get("total"));
    }
}
