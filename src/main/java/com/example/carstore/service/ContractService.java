package com.example.carstore.service;

import com.example.carstore.entity.Contract;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.Payment;
import com.example.carstore.repository.ContractRepository;
import com.example.carstore.repository.PaymentRepository;
import com.example.carstore.repository.QuotationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class ContractService {
    private final ContractRepository contractRepo;
    private final PaymentRepository paymentRepo;
    private final QuotationRepository quotationRepo;

    public ContractService(ContractRepository contractRepo, PaymentRepository paymentRepo,
            QuotationRepository quotationRepo) {
        this.contractRepo = contractRepo;
        this.paymentRepo = paymentRepo;
        this.quotationRepo = quotationRepo;
    }

    @Transactional
    public Contract createForOrder(Orders order, double total) {
        return contractRepo.findByOrderId(order.getId()).orElseGet(() -> {
            Contract contract = new Contract();
            contract.setOrderId(order.getId());
            contract.setCustomerUsername(order.getUsername());
            contract.setContractDate(new Date());
            contract.setTotal(total);
            contract.setDeposit(total * 0.10D);
            contract.setStatus("Chờ ký");
            contract.setDepositStatus("UNPAID");
            contract.setDepositAmount(total * 0.10D);
            quotationRepo.findByOrderId(order.getId()).ifPresent(q -> contract.setQuotationId(q.getId()));
            Contract saved = contractRepo.save(contract);
            saved.setContractNo(String.format("HD-%06d", saved.getId()));
            return contractRepo.save(saved);
        });
    }

    public Contract getByOrderId(Integer orderId) {
        return contractRepo.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hợp đồng."));
    }

    public List<Payment> getPayments(Integer orderId) {
        return paymentRepo.findByOrderIdOrderByPaymentDateDesc(orderId);
    }

    public List<Contract> getByCustomer(String username) {
        return contractRepo.findByCustomerUsernameOrderByContractDateDesc(username);
    }

    public List<Contract> getAll() {
        return contractRepo.findAll();
    }

    @Transactional
    public Contract update(Integer id, Contract payload) {
        Contract contract = contractRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hợp đồng."));
        if (payload.getEmployeeUsername() != null) contract.setEmployeeUsername(payload.getEmployeeUsername().trim());
        if (payload.getPdfPath() != null) contract.setPdfPath(payload.getPdfPath().trim());
        if (payload.getStatus() != null) {
            if (!List.of("Chờ ký", "Đã ký", "Hủy").contains(payload.getStatus())) {
                throw new IllegalArgumentException("Trạng thái hợp đồng không hợp lệ.");
            }
            contract.setStatus(payload.getStatus());
            if ("Đã ký".equals(payload.getStatus()) && contract.getSignedAt() == null) {
                contract.setSignedAt(new Date());
            }
        }
        return contractRepo.save(contract);
    }

    @Transactional
    public void syncDeposit(Orders order, String method) {
        contractRepo.findByOrderId(order.getId()).ifPresent(contract -> {
            contract.setDepositStatus("PAID");
            contract.setDepositAmount(order.getDepositAmount());
            contract.setDepositMethod(method);
            contract.setDepositPaidAt(order.getDepositPaidAt());
            contractRepo.save(contract);
        });
    }
}
