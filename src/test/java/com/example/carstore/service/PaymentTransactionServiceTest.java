package com.example.carstore.service;

import com.example.carstore.entity.Contract;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.PaymentTransaction;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.ContractRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.PaymentTransactionRepository;
import com.example.carstore.util.OrderStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentTransactionServiceTest {

    @Mock private PaymentTransactionRepository transactionRepo;
    @Mock private OrderRepository orderRepo;
    @Mock private OrderDetailRepository detailRepo;
    @Mock private ContractRepository contractRepo;
    @Mock private AccountRepository accountRepo;
    @Mock private MailService mailService;

    private PaymentTransactionService service;

    @BeforeEach
    void setUp() {
        service = new PaymentTransactionService(
                transactionRepo, orderRepo, detailRepo, contractRepo,
                accountRepo, mailService, new ObjectMapper());
        ReflectionTestUtils.setField(service, "merchantId", "SP-TEST");
        ReflectionTestUtils.setField(service, "secretKey", "checkout-secret");
        ReflectionTestUtils.setField(service, "apiKey", "webhook-api-key");
        ReflectionTestUtils.setField(service, "checkoutUrl",
                "https://pay-sandbox.sepay.vn/v1/checkout/init");
    }

    @Test
    void createQrUsesConfiguredMerchantAndCreatesSignature() {
        Orders order = unpaidOrder();
        Contract contract = unpaidContract();
        when(contractRepo.findByOrderId(9)).thenReturn(Optional.of(contract));

        Map<String, Object> result = service.createQr(order);

        @SuppressWarnings("unchecked")
        Map<String, String> fields = (Map<String, String>) result.get("fields");
        assertEquals("SP-TEST", fields.get("merchant"));
        assertEquals("VELORA-9", fields.get("order_invoice_number"));
        assertEquals("100", fields.get("order_amount"));
        assertNotNull(fields.get("signature"));
        assertFalse(fields.get("signature").isBlank());
    }

    @Test
    void flatWebhookUpdatesPaymentOrderAndContract() {
        Orders order = unpaidOrder();
        Contract contract = unpaidContract();
        when(transactionRepo.existsByTransactionNo("SEPAY-TX-001")).thenReturn(false);
        when(orderRepo.findForUpdateById(9)).thenReturn(Optional.of(order));
        when(contractRepo.findByOrderId(9)).thenReturn(Optional.of(contract));
        when(accountRepo.findByUsername("user1")).thenReturn(Optional.empty());
        when(accountRepo.findAll()).thenReturn(List.of());

        service.processSePayWebhook(Map.of(
                "referenceCode", "TX-001",
                "transferAmount", 100,
                "transactionContent", "Thanh toan VELORA-9"));

        assertEquals(OrderStatus.DEPOSIT_PAID, order.getDepositStatus());
        assertEquals("SePay", order.getDepositMethod());
        assertEquals("PAID", contract.getDepositStatus());
        assertEquals("SePay", contract.getDepositMethod());
        ArgumentCaptor<PaymentTransaction> captor =
                ArgumentCaptor.forClass(PaymentTransaction.class);
        verify(transactionRepo).save(captor.capture());
        assertEquals("SEPAY-TX-001", captor.getValue().getTransactionNo());
        assertEquals("SUCCESS", captor.getValue().getStatus());
        assertEquals(100D, captor.getValue().getAmount());
        verifyNoInteractions(mailService);
    }

    @Test
    void duplicateWebhookDoesNotUpdateOrSendEmail() {
        when(transactionRepo.existsByTransactionNo("SEPAY-TX-001")).thenReturn(true);

        service.processSePayWebhook(Map.of(
                "referenceCode", "TX-001",
                "transferAmount", 100,
                "content", "VELORA-9"));

        verify(orderRepo, never()).findForUpdateById(anyInt());
        verify(transactionRepo, never()).save(any());
        verifyNoInteractions(mailService);
    }

    @Test
    void wrongAmountDoesNotUpdatePaymentState() {
        Orders order = unpaidOrder();
        Contract contract = unpaidContract();
        when(transactionRepo.existsByTransactionNo("SEPAY-TX-002")).thenReturn(false);
        when(orderRepo.findForUpdateById(9)).thenReturn(Optional.of(order));
        when(contractRepo.findByOrderId(9)).thenReturn(Optional.of(contract));

        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.processSePayWebhook(Map.of(
                        "referenceCode", "TX-002",
                        "transferAmount", 99,
                        "description", "VELORA-9")));

        assertTrue(error.getMessage().contains("không khớp"));
        assertEquals(OrderStatus.DEPOSIT_UNPAID, order.getDepositStatus());
        verify(orderRepo, never()).save(any());
        verify(transactionRepo, never()).save(any());
        verifyNoInteractions(mailService);
    }

    private Orders unpaidOrder() {
        Orders order = new Orders();
        order.setId(9);
        order.setUsername("user1");
        order.setStatus(OrderStatus.PENDING);
        order.setDepositStatus(OrderStatus.DEPOSIT_UNPAID);
        return order;
    }

    private Contract unpaidContract() {
        Contract contract = new Contract();
        contract.setOrderId(9);
        contract.setDepositAmount(100D);
        contract.setDepositStatus("UNPAID");
        return contract;
    }
}
