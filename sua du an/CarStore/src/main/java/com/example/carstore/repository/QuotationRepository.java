package com.example.carstore.repository;

import com.example.carstore.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Integer> {
    
    // Tìm danh sách báo giá theo username của khách hàng
    List<Quotation> findByCustomerUsername(String customerUsername);
    
    // Tìm báo giá theo trạng thái (dùng cho Admin lọc)
    List<Quotation> findByStatus(String status);
}
