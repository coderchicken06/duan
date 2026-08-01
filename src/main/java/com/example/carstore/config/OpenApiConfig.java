package com.example.carstore.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI carStoreOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CarStore API")
                        .version("1.0")
                        .description("API Documentation cho hệ thống CarStore"));
    }
}
