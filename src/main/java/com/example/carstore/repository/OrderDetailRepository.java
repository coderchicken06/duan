package com.example.carstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.example.carstore.entity.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    List<OrderDetail> findByOrderId(Integer orderId);

    boolean existsByCar_Id(Integer carId);

    // Tính tổng doanh thu
    @Query("SELECT SUM(o.depositAmount) FROM Orders o WHERE o.depositStatus = 'PAID'")
    Double getRevenue();

    // Chỉ tính xe trong các đơn đã thanh toán cọc.
    @Query("SELECT d.car.name, SUM(d.quantity) FROM OrderDetail d, Orders o " +
           "WHERE d.orderId = o.id AND o.depositStatus = 'PAID' " +
           "GROUP BY d.car.name " +
           "ORDER BY SUM(d.quantity) DESC")
    List<Object[]> topCars();
}
