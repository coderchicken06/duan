package com.example.carstore.service;

import com.example.carstore.dto.ContractResponseDto;
import com.example.carstore.entity.Contract;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.PaymentTransaction;
import com.example.carstore.repository.ContractRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.PaymentTransactionRepository;
import com.example.carstore.repository.QuotationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.Date;
import java.util.List;

@Service
public class ContractService {
    private final ContractRepository contractRepo;
    private final OrderDetailRepository orderDetailRepo;
    private final PaymentTransactionRepository paymentTransactionRepo;
    private final QuotationRepository quotationRepo;
    private final OrderRepository orderRepo;

    public ContractService(ContractRepository contractRepo, OrderDetailRepository orderDetailRepo,
            PaymentTransactionRepository paymentTransactionRepo,
            QuotationRepository quotationRepo,
            OrderRepository orderRepo) {
        this.contractRepo = contractRepo;
        this.orderDetailRepo = orderDetailRepo;
        this.paymentTransactionRepo = paymentTransactionRepo;
        this.quotationRepo = quotationRepo;
        this.orderRepo = orderRepo;
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
            saved.setContractNo(String.format("HD-%03d", saved.getId()));
            return contractRepo.save(saved);
        });
    }

    public Contract getByOrderId(Integer orderId) {
        return contractRepo.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Hợp đồng chưa được tạo cho đơn hàng này."));
    }

    public void assertCurrentUserCanAccess(Orders order, Authentication authentication) {
        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập.");
        }
        boolean admin = authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        if (!admin && !authentication.getName().equals(order.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem hợp đồng này.");
        }
    }

    public List<PaymentTransaction> getPayments(Integer orderId) {
        return paymentTransactionRepo.findByOrderIdOrderByPaidAtDesc(orderId);
    }

    public List<Contract> getByCustomer(String username) {
        return contractRepo.findByCustomerUsernameOrderByContractDateDesc(username);
    }

    public List<Contract> getAll() {
        return contractRepo.findAll();
    }

    public List<ContractResponseDto> toResponses(List<Contract> contracts) {
        if (contracts.isEmpty()) {
            return List.of();
        }

        List<Integer> orderIds = contracts.stream().map(Contract::getOrderId).toList();
        java.util.Map<Integer, String> carNamesByOrderId = new java.util.HashMap<>();
        for (var detail : orderDetailRepo.findByOrderIdInWithCar(orderIds)) {
            if (detail.getCar() != null && detail.getCar().getName() != null && !detail.getCar().getName().isBlank()) {
                carNamesByOrderId.putIfAbsent(detail.getOrderId(), detail.getCar().getName());
            }
        }
        return contracts.stream().map(contract -> toResponse(contract, carNamesByOrderId)).toList();
    }

    public ContractResponseDto toResponse(Contract contract) {
        return toResponse(contract, java.util.Map.of());
    }

    private ContractResponseDto toResponse(Contract contract, java.util.Map<Integer, String> carNamesByOrderId) {
        ContractResponseDto dto = new ContractResponseDto();
        dto.setId(contract.getId());
        dto.setContractNo(String.format("HD-%03d", contract.getId()));
        dto.setCustomerUsername(contract.getCustomerUsername());
        dto.setEmployeeUsername(contract.getEmployeeUsername());
        dto.setOrderId(contract.getOrderId());
        dto.setQuotationId(contract.getQuotationId());
        dto.setTotal(contract.getTotal());
        dto.setStatus(contract.getStatus());
        dto.setPdfPath(contract.getPdfPath());

        String carName = carNamesByOrderId.get(contract.getOrderId());
        if (carName == null) {
            carName = orderDetailRepo.findByOrderIdWithCar(contract.getOrderId()).stream()
                    .map(detail -> detail.getCar() == null ? null : detail.getCar().getName())
                    .filter(name -> name != null && !name.isBlank())
                    .findFirst()
                    .orElse("Xe chưa xác định");
        }
        dto.setCarName(carName);
        dto.setProductName(carName);
        return dto;
    }

    public boolean existsByQuotationId(Integer quotationId) {
        return contractRepo.existsByQuotationId(quotationId);
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
            if (!payload.getStatus().equals(contract.getStatus())) {
                if ("Đã ký".equals(contract.getStatus()) || "Hủy".equals(contract.getStatus())) {
                    throw new IllegalArgumentException("Không thể thay đổi hợp đồng đã kết thúc.");
                }
                if (!"Chờ ký".equals(contract.getStatus())) {
                    throw new IllegalArgumentException("Trạng thái hợp đồng hiện tại không cho phép chuyển đổi.");
                }
                if ("Đã ký".equals(payload.getStatus())) {
                    Orders order = orderRepo.findById(contract.getOrderId())
                            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng liên kết với hợp đồng."));
                    if (!"PAID".equalsIgnoreCase(order.getDepositStatus())) {
                        throw new IllegalArgumentException("Không thể ký hợp đồng khi đơn hàng chưa thanh toán tiền cọc!");
                    }
                }
                contract.setStatus(payload.getStatus());
                if ("Đã ký".equals(payload.getStatus()) && contract.getSignedAt() == null) {
                    contract.setSignedAt(new Date());
                }
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

    @Transactional
    public void cancelForOrder(Integer orderId) {
        contractRepo.findByOrderId(orderId).ifPresent(contract -> {
            if (!"Hủy".equals(contract.getStatus())) {
                contract.setStatus("Hủy");
                contractRepo.save(contract);
            }
        });
    }
}
