package com.example.carstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.carstore.entity.Car;

public interface CarRepository extends JpaRepository<Car, Integer> {

    List<Car> findByNameContainingIgnoreCase(String name);

    long countByBrandId(Integer brandId);

    List<Car> findTop6ByBodyTypeAndIdNotOrderByPriceAsc(String bodyType, Integer id);

    List<Car> findTop6ByBrandIdAndIdNotOrderByPriceAsc(Integer brandId, Integer id);
}