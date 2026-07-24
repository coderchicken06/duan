package com.example.carstore.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private static final SecureRandom random = new SecureRandom();

    public String generateOtp() {
        return String.format("%06d", random.nextInt(1000000));
    }

    public LocalDateTime expiredTime() {
        return LocalDateTime.now().plusMinutes(5);
    }

    public boolean isExpired(LocalDateTime time) {
        return time == null || LocalDateTime.now().isAfter(time);
    }
}