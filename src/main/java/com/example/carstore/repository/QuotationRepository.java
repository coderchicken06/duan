package com.example.carstore.repository;

import com.example.carstore.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import javax.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface QuotationRepository extends JpaRepository<Quotation, Integer> {
    List<Quotation> findByCustomerUsername(String customerUsername);
    List<Quotation> findByCustomerUsernameOrderByQuotationDateDesc(String username);
    List<Quotation> findByStatus(String status);
    boolean existsByCustomerUsernameAndCarIdAndStatus(String username, Integer carId, String status);
    boolean existsByCarId(Integer carId);
    boolean existsByCustomerUsername(String customerUsername);
    java.util.Optional<Quotation> findByOrderId(Integer orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Quotation> findForUpdateById(Integer id);
}
