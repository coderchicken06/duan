package com.example.carstore.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "PaymentTransaction", schema = "dbo")
public class PaymentTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "order_id", nullable = false) private Integer orderId;
    private String gateway;
    @Column(name = "transaction_no", nullable = false, unique = true) private String transactionNo;
    @Column(name = "bank_code") private String bankCode;
    private Double amount;
    private String status;
    @Column(name = "response_code") private String responseCode;
    @Temporal(TemporalType.TIMESTAMP) @Column(name = "paid_at") private Date paidAt;
    @Column(name = "raw_response") private String rawResponse;
    public Integer getId(){return id;} public void setId(Integer v){id=v;}
    public Integer getOrderId(){return orderId;} public void setOrderId(Integer v){orderId=v;}
    public String getGateway(){return gateway;} public void setGateway(String v){gateway=v;}
    public String getTransactionNo(){return transactionNo;} public void setTransactionNo(String v){transactionNo=v;}
    public String getBankCode(){return bankCode;} public void setBankCode(String v){bankCode=v;}
    public Double getAmount(){return amount;} public void setAmount(Double v){amount=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getResponseCode(){return responseCode;} public void setResponseCode(String v){responseCode=v;}
    public Date getPaidAt(){return paidAt;} public void setPaidAt(Date v){paidAt=v;}
    public String getRawResponse(){return rawResponse;} public void setRawResponse(String v){rawResponse=v;}
}
