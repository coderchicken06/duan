package com.example.carstore.repository;

import com.example.carstore.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Integer> {
    List<Quotation> findByCustomerUsername(String customerUsername);
    List<Quotation> findByCustomerUsernameOrderByQuotationDateDesc(String username);
    List<Quotation> findByStatus(String status);
    boolean existsByCustomerUsernameAndCarIdAndStatus(String username, Integer carId, String status);
    java.util.Optional<Quotation> findByOrderId(Integer orderId);
}
