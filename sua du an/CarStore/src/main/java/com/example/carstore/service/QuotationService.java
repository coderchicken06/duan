package com.example.carstore.service;

import com.example.carstore.entity.Quotation;
import com.example.carstore.repository.QuotationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class QuotationService {

    private final QuotationRepository quotationRepo;

    public QuotationService(QuotationRepository quotationRepo) {
        this.quotationRepo = quotationRepo;
    }

    public List<Quotation> getAll() {
        return quotationRepo.findAll();
    }

    public List<Quotation> getByCustomer(String username) {
        return quotationRepo.findByCustomerUsername(username);
    }

    public Quotation getById(int id) {
        return quotationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay bao gia voi ID: " + id));
    }

    @Transactional
    public Quotation createQuotation(String username, Integer carId, Double carPrice, String note) {
        if (carId == null || carPrice == null || carPrice <= 0) {
            throw new IllegalArgumentException("Thong tin xe hoac gia xe khong hop le");
        }

        Quotation quotation = new Quotation();
        quotation.setCustomerUsername(username);
        quotation.setCarId(carId);
        quotation.setCarPrice(carPrice);
        quotation.setDiscount(0.0);
        quotation.setTotalPrice(carPrice); // Ban dau chua co giam gia
        quotation.setNote(note);
        quotation.setStatus("Chờ xác nhận");
        quotation.setQuotationDate(new Date());

        return quotationRepo.save(quotation);
    }

    @Transactional
    public Quotation updateDiscountAndStatus(int id, Double discount, String status) {
        Quotation quotation = getById(id);

        if (discount != null && discount >= 0) {
            quotation.setDiscount(discount);
            double finalPrice = quotation.getCarPrice() - discount;
            quotation.setTotalPrice(Math.max(finalPrice, 0.0)); // Tránh tổng tiền bị âm
        }

        if (status != null && !status.trim().isEmpty()) {
            quotation.setStatus(status.trim());
        }

        return quotationRepo.save(quotation);
    }

    @Transactional
    public void deleteQuotation(int id) {
        if (!quotationRepo.existsById(id)) {
            throw new IllegalArgumentException("Bao gia khong ton tai");
        }
        quotationRepo.deleteById(id);
    }
}
