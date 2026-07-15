package com.example.carstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.carstore.entity.Account;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    
Optional<Account> findByUsername(String username);

Optional<Account> findByEmail(String email);
}

