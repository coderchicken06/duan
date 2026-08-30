package com.example.carstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import com.example.carstore.entity.Orders;
import javax.persistence.LockModeType;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findByUsername(String username);
    boolean existsByUsername(String username);

    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END "
            + "FROM Orders o, OrderDetail d "
            + "WHERE o.id = d.orderId AND o.username = :username "
            + "AND d.car.id = :carId AND o.status = :status")
    boolean existsCompletedPurchase(@Param("username") String username,
            @Param("carId") Integer carId, @Param("status") String status);

    @Query("SELECT d.orderId, d.car.name, d.car.image "
            + "FROM OrderDetail d "
            + "WHERE d.orderId IN :orderIds "
            + "ORDER BY d.orderId, d.id")
    List<Object[]> findProductSummariesByOrderIds(@Param("orderIds") List<Integer> orderIds);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Orders> findForUpdateById(Integer id);

    List<Orders> findByDepositStatusAndStatusAndCreateDateBefore(
            String depositStatus, String status, Date createDateBefore);

}
