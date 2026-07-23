package com.example.carstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import com.example.carstore.entity.Car;
import javax.persistence.LockModeType;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Integer> {

    List<Car> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description);

    long countByBrandId(Integer brandId);

    List<Car> findTop6ByBodyTypeAndIdNotOrderByPriceAsc(String bodyType, Integer id);

    List<Car> findTop6ByBrandIdAndIdNotOrderByPriceAsc(Integer brandId, Integer id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Car> findForUpdateById(Integer id);
}
