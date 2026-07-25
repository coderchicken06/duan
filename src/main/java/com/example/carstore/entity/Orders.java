package com.example.carstore.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Orders") // Khuyên dùng đúng tên bảng trong SQL
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date")
    private Date createDate = new Date(); // Tự động gán ngày tạo mặc định

    private String address;

    // --- BỔ SUNG 1: Địa chỉ đăng ký xe ---
    @Column(name = "registration_address")
    private String registrationAddress;

    // --- BỔ SUNG 2: Phương thức thanh toán ---
    @Column(name = "payment_method")
    private String paymentMethod;

    private String status;

    @Column(name = "deposit_status")
    private String depositStatus;

    @Column(name = "deposit_amount")
    private Double depositAmount;

    @Column(name = "deposit_method")
    private String depositMethod;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "deposit_paid_at")
    private Date depositPaidAt;

    // --- CONSTRUCTORS ---
    public Orders() {
    }

    public Orders(Integer id, String username, Date createDate, String address,
                  String registrationAddress, String paymentMethod, String status,
                  String depositStatus, Double depositAmount, String depositMethod, Date depositPaidAt) {
        this.id = id;
        this.username = username;
        this.createDate = createDate;
        this.address = address;
        this.registrationAddress = registrationAddress;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.depositStatus = depositStatus;
        this.depositAmount = depositAmount;
        this.depositMethod = depositMethod;
        this.depositPaidAt = depositPaidAt;
    }

    // --- GETTERS & SETTERS ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRegistrationAddress() {
        return registrationAddress;
    }

    public void setRegistrationAddress(String registrationAddress) {
        this.registrationAddress = registrationAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDepositStatus() {
        return depositStatus;
    }

    public void setDepositStatus(String depositStatus) {
        this.depositStatus = depositStatus;
    }

    public Double getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(Double depositAmount) {
        this.depositAmount = depositAmount;
    }

    public String getDepositMethod() {
        return depositMethod;
    }

    public void setDepositMethod(String depositMethod) {
        this.depositMethod = depositMethod;
    }

    public Date getDepositPaidAt() {
        return depositPaidAt;
    }

    public void setDepositPaidAt(Date depositPaidAt) {
        this.depositPaidAt = depositPaidAt;
    }
}
