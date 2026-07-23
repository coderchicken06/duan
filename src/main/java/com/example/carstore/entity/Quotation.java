package com.example.carstore.entity;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Quotation", schema = "dbo")
public class Quotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "customer_username", nullable = false)
    private String customerUsername;

    @Column(name = "car_id", nullable = false)
    private Integer carId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "quotation_date")
    private Date quotationDate = new Date();

    @Column(name = "car_price", nullable = false)
    private Double carPrice;

    @Column(name = "discount", nullable = false)
    private Double discount = 0.0;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    private String note;
    private String status = "Chờ xác nhận";

    @Column(name = "quotation_no")
    private String quotationNo;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "order_id")
    private Integer orderId;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "quotation_id", insertable = false, updatable = false)
    @OrderBy("id ASC")
    private List<QuotationItem> items;

    public Quotation() {
    }

    public Quotation(Integer id, String customerUsername, Integer carId, Date quotationDate,
                     Double carPrice, Double discount, Double totalPrice, String note, String status) {
        this.id = id;
        this.customerUsername = customerUsername;
        this.carId = carId;
        this.quotationDate = quotationDate;
        this.carPrice = carPrice;
        this.discount = discount;
        this.totalPrice = totalPrice;
        this.note = note;
        this.status = status;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCustomerUsername() { return customerUsername; }
    public void setCustomerUsername(String customerUsername) { this.customerUsername = customerUsername; }
    public Integer getCarId() { return carId; }
    public void setCarId(Integer carId) { this.carId = carId; }
    public Date getQuotationDate() { return quotationDate; }
    public void setQuotationDate(Date quotationDate) { this.quotationDate = quotationDate; }
    public Double getCarPrice() { return carPrice; }
    public void setCarPrice(Double carPrice) { this.carPrice = carPrice; }
    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getQuotationNo() { return quotationNo; }
    public void setQuotationNo(String quotationNo) { this.quotationNo = quotationNo; }
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }
    public List<QuotationItem> getItems() { return items; }
}
