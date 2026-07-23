package com.example.carstore.dto;
public class QuotationRequestDto {
    private Integer carId;
    private Double discount;
    private String note;
    private String status;
    private Integer quantity;
    private String address;
    private String registrationAddress;
    private String paymentMethod;
    public Integer getCarId(){return carId;} public void setCarId(Integer v){carId=v;}
    public Double getDiscount(){return discount;} public void setDiscount(Double v){discount=v;}
    public String getNote(){return note;} public void setNote(String v){note=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public Integer getQuantity(){return quantity;} public void setQuantity(Integer v){quantity=v;}
    public String getAddress(){return address;} public void setAddress(String v){address=v;}
    public String getRegistrationAddress(){return registrationAddress;} public void setRegistrationAddress(String v){registrationAddress=v;}
    public String getPaymentMethod(){return paymentMethod;} public void setPaymentMethod(String v){paymentMethod=v;}
}
