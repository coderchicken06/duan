package com.example.carstore.repository;

import com.example.carstore.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    Optional<Contract> findByOrderId(Integer orderId);
    List<Contract> findByCustomerUsernameOrderByContractDateDesc(String username);
    Page<Contract> findByCustomerUsernameOrderByContractDateDesc(String username, Pageable pageable);
    boolean existsByQuotationId(Integer quotationId);
    boolean existsByCustomerUsernameOrEmployeeUsername(String customerUsername, String employeeUsername);
}
