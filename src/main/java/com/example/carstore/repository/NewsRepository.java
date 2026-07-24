package com.example.carstore.repository;
import com.example.carstore.entity.News;import org.springframework.data.jpa.repository.JpaRepository;import java.util.*;
public interface NewsRepository extends JpaRepository<News,Integer>{Optional<News> findBySlug(String slug);List<News> findByStatusOrderByCreatedAtDesc(String status);boolean existsBySlugAndIdNot(String slug,Integer id);}
