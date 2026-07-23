package com.example.carstore.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date")
    private Date create_date;

    private String address;

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

    public Orders() {
    }

    public Orders(Integer id, String username, Date create_date, String address, String status) {
        this.id = id;
        this.username = username;
        this.create_date = create_date;
        this.address = address;
        this.status = status;
    }

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

    public Date getCreate_date() {
        return create_date;
    }

    public void setCreate_date(Date create_date) {
        this.create_date = create_date;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDepositStatus() { return depositStatus; }
    public void setDepositStatus(String depositStatus) { this.depositStatus = depositStatus; }
    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }
    public String getDepositMethod() { return depositMethod; }
    public void setDepositMethod(String depositMethod) { this.depositMethod = depositMethod; }
    public Date getDepositPaidAt() { return depositPaidAt; }
    public void setDepositPaidAt(Date depositPaidAt) { this.depositPaidAt = depositPaidAt; }
}