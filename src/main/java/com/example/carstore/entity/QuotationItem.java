package com.example.carstore.entity;

import javax.persistence.*;

@Entity
@Table(name = "QuotationItem", schema = "dbo")
public class QuotationItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "quotation_id", nullable = false)
    private Integer quotationId;

    @Column(name = "car_id", nullable = false)
    private Integer carId;

    private Integer quantity;

    @Column(name = "unit_price")
    private Double unitPrice;

    private Double discount;
    private Double total;

    public Integer getId() { return id; }
    public Integer getQuotationId() { return quotationId; }
    public void setQuotationId(Integer quotationId) { this.quotationId = quotationId; }
    public Integer getCarId() { return carId; }
    public void setCarId(Integer carId) { this.carId = carId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
}
