package com.example.carstore.repository;
import com.example.carstore.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction,Integer>{
 List<PaymentTransaction> findByOrderIdOrderByPaidAtDesc(Integer orderId);
 boolean existsByTransactionNo(String transactionNo);
}
