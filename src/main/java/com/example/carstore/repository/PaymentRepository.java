package com.example.carstore.repository;

import com.example.carstore.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByOrderIdOrderByPaymentDateDesc(Integer orderId);
}
