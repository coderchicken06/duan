package com.example.carstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import com.example.carstore.entity.Car;
import javax.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CarRepository extends JpaRepository<Car, Integer> {

    List<Car> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description);

    long countByBrandId(Integer brandId);

    List<Car> findTop6ByBodyTypeAndIdNotOrderByPriceAsc(String bodyType, Integer id);

    List<Car> findTop6ByBrandIdAndIdNotOrderByPriceAsc(Integer brandId, Integer id);

    // Khóa bản ghi xe đến hết transaction để hai checkout không cùng trừ một lượng tồn.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Car> findForUpdateById(Integer id);

    Optional<Car> findByIdAndStatus(Integer id, String status);

    @Query("SELECT c FROM Car c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :kw, '%')) "
            + "AND c.status = 'AVAILABLE'")
    List<Car> findTop5Suggestions(@Param("kw") String kw, Pageable pageable);

    @Query("SELECT c FROM Car c, Brand b WHERE c.brandId = b.id AND c.status = 'AVAILABLE' AND ("
            + "LOWER(c.name) LIKE LOWER(CONCAT('%', :kw, '%')) OR "
            + "LOWER(b.name) LIKE LOWER(CONCAT('%', :kw, '%')) OR "
            + "LOWER(COALESCE(c.fuelType, '')) LIKE LOWER(CONCAT('%', :kw, '%')) OR "
            + "LOWER(CAST(c.seats AS string)) LIKE LOWER(CONCAT('%', :kw, '%'))"
            + ")")
    List<Car> findSmartSuggestions(@Param("kw") String keyword, Pageable pageable);
}
