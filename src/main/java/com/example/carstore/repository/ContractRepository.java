package com.example.carstore.repository;

import com.example.carstore.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    Optional<Contract> findByOrderId(Integer orderId);
    List<Contract> findByCustomerUsernameOrderByContractDateDesc(String username);
}
