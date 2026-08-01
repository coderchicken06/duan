package com.example.carstore.repository;
import com.example.carstore.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction,Integer>{
 List<PaymentTransaction> findByOrderIdOrderByPaidAtDesc(Integer orderId);
 boolean existsByTransactionNo(String transactionNo);
 @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM PaymentTransaction p WHERE p.transactionNo = :referenceNumber")
 boolean existsByReferenceNumber(@Param("referenceNumber") String referenceNumber);
}
