package com.example.carstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.example.carstore.entity.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    List<OrderDetail> findByOrderId(Integer orderId);

    @Query("SELECT d FROM OrderDetail d JOIN FETCH d.car WHERE d.orderId = :orderId")
    List<OrderDetail> findByOrderIdWithCar(@Param("orderId") Integer orderId);

    @Query("SELECT d FROM OrderDetail d JOIN FETCH d.car WHERE d.orderId IN :orderIds")
    List<OrderDetail> findByOrderIdInWithCar(@Param("orderIds") List<Integer> orderIds);

    boolean existsByCar_Id(Integer carId);

    // Doanh thu chỉ lấy đơn đã cọc; loại đơn chờ và đơn hủy để số liệu không bị cộng sai.
    @Query("SELECT SUM(o.depositAmount) FROM Orders o " +
           "WHERE o.depositStatus = 'PAID' AND o.status NOT IN ('CANCELLED', 'PENDING')")
    Double getRevenue();

    // Xe bán chạy cũng chỉ đếm từ đơn đã cọc và đã qua trạng thái chờ xử lý.
    @Query("SELECT d.car.name, SUM(d.quantity) FROM OrderDetail d, Orders o " +
           "WHERE d.orderId = o.id AND o.depositStatus = 'PAID' " +
           "AND o.status NOT IN ('CANCELLED', 'PENDING') " +
           "GROUP BY d.car.name " +
           "ORDER BY SUM(d.quantity) DESC")
    List<Object[]> topCars();
}
