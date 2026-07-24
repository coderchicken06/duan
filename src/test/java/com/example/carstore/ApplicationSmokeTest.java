package com.example.carstore;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ApplicationSmokeTest {
    @Autowired
    private MockMvc mvc;

    @Test
    void publicPagesAndCatalogApisAreAvailable() throws Exception {
        mvc.perform(get("/news"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
        mvc.perform(get("/api/cars")).andExpect(status().isOk());
        mvc.perform(get("/api/news")).andExpect(status().isOk());
        mvc.perform(get("/api/promotions")).andExpect(status().isOk());
        mvc.perform(get("/api/promotions/car/1")).andExpect(status().isOk());
    }

    @Test
    void protectedBusinessApisRequireAuthentication() throws Exception {
        mvc.perform(get("/api/orders")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/payment-transactions/orders/1"))
                .andExpect(status().isUnauthorized());
    }
}
