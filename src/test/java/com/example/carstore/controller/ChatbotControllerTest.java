package com.example.carstore.controller;

import com.example.carstore.entity.Car;
import com.example.carstore.repository.CarRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ChatbotControllerTest {

    @Test
    void searchReturnsOnlyAvailableCars() {
        CarRepository cars = mock(CarRepository.class);
        ChatbotController controller = new ChatbotController(cars);
        Car available = car(1, "AVAILABLE");
        Car sold = car(2, "SOLD");
        Car inactive = car(3, "INACTIVE");
        when(cars.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase("camry", "camry"))
                .thenReturn(List.of(available, sold, inactive));

        ResponseEntity<Map<String, Object>> response = controller.processMessage(
                Map.of("message", "tìm xe camry"));

        @SuppressWarnings("unchecked")
        List<Car> result = (List<Car>) response.getBody().get("cars");
        assertEquals(List.of(available), result);
    }

    private Car car(int id, String status) {
        Car car = new Car();
        car.setId(id);
        car.setStatus(status);
        return car;
    }
}
