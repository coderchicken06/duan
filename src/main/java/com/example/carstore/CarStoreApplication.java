package com.example.carstore;

import com.example.carstore.config.SepayProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(SepayProperties.class)
public class CarStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarStoreApplication.class, args);
    }
}
