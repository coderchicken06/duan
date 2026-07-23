package com.example.carstore.service;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.PaymentTransaction;
import com.example.carstore.repository.PaymentTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service public class PaymentTransactionService{
 private final PaymentTransactionRepository repo;
 public PaymentTransactionService(PaymentTransactionRepository repo){this.repo=repo;}
 public List<PaymentTransaction> byOrder(Integer orderId){return repo.findByOrderIdOrderByPaidAtDesc(orderId);}
 @Transactional public PaymentTransaction recordSuccessfulDeposit(Orders order,String gateway){
  String transactionNo="PAY-"+order.getId()+"-"+order.getDepositPaidAt().getTime();
  if(repo.existsByTransactionNo(transactionNo))throw new IllegalArgumentException("Giao dịch đã được ghi nhận.");
  PaymentTransaction t=new PaymentTransaction();t.setOrderId(order.getId());t.setGateway(gateway);
  t.setTransactionNo(transactionNo);t.setAmount(order.getDepositAmount());t.setStatus("SUCCESS");
  t.setResponseCode("00");t.setPaidAt(order.getDepositPaidAt());return repo.save(t);
 }
}
