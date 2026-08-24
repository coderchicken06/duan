package com.example.carstore.dto;

import java.util.Date;

/**
 * Dữ liệu đơn hàng tối giản phục vụ bảng lịch sử của khách hàng và quản trị.
 * Không trả OrderDetail/Car entity để tránh vòng lặp JSON và lazy-loading ngoài ý muốn.
 */
public class OrderResponseDto {
    private Integer id;
    private String username;
    private Date createDate;
    private String address;
    private String registrationAddress;
    private String paymentMethod;
    private String status;
    private String depositStatus;
    private Double depositAmount;
    private String depositMethod;
    private Date paidAt;
    private Date paymentTime;
    private String carName;
    private String productName;
    private String carImage;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Date getCreateDate() { return createDate; }
    public void setCreateDate(Date createDate) { this.createDate = createDate; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getRegistrationAddress() { return registrationAddress; }
    public void setRegistrationAddress(String registrationAddress) { this.registrationAddress = registrationAddress; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDepositStatus() { return depositStatus; }
    public void setDepositStatus(String depositStatus) { this.depositStatus = depositStatus; }
    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }
    public String getDepositMethod() { return depositMethod; }
    public void setDepositMethod(String depositMethod) { this.depositMethod = depositMethod; }
    public Date getPaidAt() { return paidAt; }
    public void setPaidAt(Date paidAt) { this.paidAt = paidAt; }
    public Date getPaymentTime() { return paymentTime; }
    public void setPaymentTime(Date paymentTime) { this.paymentTime = paymentTime; }
    public String getCarName() { return carName; }
    public void setCarName(String carName) { this.carName = carName; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getCarImage() { return carImage; }
    public void setCarImage(String carImage) { this.carImage = carImage; }
}
