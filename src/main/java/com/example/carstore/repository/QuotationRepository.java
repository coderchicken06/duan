package com.example.carstore.repository;

import com.example.carstore.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import javax.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuotationRepository extends JpaRepository<Quotation, Integer> {
    List<Quotation> findByCustomerUsername(String customerUsername);
    List<Quotation> findByCustomerUsernameOrderByQuotationDateDesc(String username);
    List<Quotation> findByStatus(String status);
    boolean existsByCustomerUsernameAndCarIdAndStatus(String username, Integer carId, String status);
    boolean existsByCarId(Integer carId);
    boolean existsByCustomerUsername(String customerUsername);
    java.util.Optional<Quotation> findByOrderId(Integer orderId);

    @Query("SELECT DISTINCT q FROM Quotation q LEFT JOIN FETCH q.items "
            + "ORDER BY q.quotationDate DESC")
    List<Quotation> findAllWithItems();

    @Query("SELECT DISTINCT q FROM Quotation q LEFT JOIN FETCH q.items "
            + "WHERE q.customerUsername = :username ORDER BY q.quotationDate DESC")
    List<Quotation> findByCustomerUsernameWithItems(@Param("username") String username);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Quotation> findForUpdateById(Integer id);
}
