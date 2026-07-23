package com.example.carstore.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Contract", schema = "dbo")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "order_id", nullable = false, unique = true)
    private Integer orderId;
    @Column(name = "customer_username", nullable = false)
    private String customerUsername;
    @Column(name = "employee_username")
    private String employeeUsername;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "contract_date")
    private Date contractDate;
    private Double deposit;
    private Double total;
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
    @Column(name = "contract_no")
    private String contractNo;
    @Column(name = "quotation_id")
    private Integer quotationId;
    @Column(name = "pdf_path")
    private String pdfPath;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "signed_at")
    private Date signedAt;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }
    public String getCustomerUsername() { return customerUsername; }
    public void setCustomerUsername(String customerUsername) { this.customerUsername = customerUsername; }
    public String getEmployeeUsername() { return employeeUsername; }
    public void setEmployeeUsername(String employeeUsername) { this.employeeUsername = employeeUsername; }
    public Date getContractDate() { return contractDate; }
    public void setContractDate(Date contractDate) { this.contractDate = contractDate; }
    public Double getDeposit() { return deposit; }
    public void setDeposit(Double deposit) { this.deposit = deposit; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
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
    public Date getDepositPaidAt() { return depositPaidAt; }
    public void setDepositPaidAt(Date depositPaidAt) { this.depositPaidAt = depositPaidAt; }
    public String getContractNo() { return contractNo; }
    public void setContractNo(String contractNo) { this.contractNo = contractNo; }
    public Integer getQuotationId() { return quotationId; }
    public void setQuotationId(Integer quotationId) { this.quotationId = quotationId; }
    public String getPdfPath() { return pdfPath; }
    public void setPdfPath(String pdfPath) { this.pdfPath = pdfPath; }
    public Date getSignedAt() { return signedAt; }
    public void setSignedAt(Date signedAt) { this.signedAt = signedAt; }
}
