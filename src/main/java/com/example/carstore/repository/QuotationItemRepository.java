package com.example.carstore.repository;

import com.example.carstore.entity.QuotationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuotationItemRepository extends JpaRepository<QuotationItem, Integer> {
    List<QuotationItem> findByQuotationIdOrderByIdAsc(Integer quotationId);
}
