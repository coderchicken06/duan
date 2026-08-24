package com.example.carstore.service;

import com.example.carstore.dto.QuotationRequestDto;
import com.example.carstore.entity.Car;
import com.example.carstore.entity.Quotation;
import com.example.carstore.entity.QuotationItem;
import com.example.carstore.entity.Orders;
import com.example.carstore.entity.OrderDetail;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.QuotationRepository;
import com.example.carstore.repository.QuotationItemRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.util.OrderStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.Calendar;
import java.util.List;

@Service
public class QuotationService {
    public static final String PENDING = "Chờ xác nhận";
    public static final String APPROVED = "Đã duyệt";
    public static final String CONFIRMED = "Khách đã xác nhận";
    public static final String REJECTED = "Từ chối";
    public static final String CONVERTED = "Đã chuyển đơn";

    private final QuotationRepository repo;
    private final CarRepository carRepo;
    private final QuotationItemRepository itemRepo;
    private final OrderRepository orderRepo;
    private final OrderDetailRepository detailRepo;
    private final ContractService contractService;
    private final PromotionService promotionService;

    public QuotationService(QuotationRepository repo, CarRepository carRepo,
            QuotationItemRepository itemRepo, OrderRepository orderRepo,
            OrderDetailRepository detailRepo, ContractService contractService,
            PromotionService promotionService) {
        this.repo = repo;
        this.carRepo = carRepo;
        this.itemRepo = itemRepo;
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.contractService = contractService;
        this.promotionService = promotionService;
    }

    @Transactional
    public Quotation create(String username, QuotationRequestDto request) {
        Car car = carRepo.findById(request.getCarId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe."));
        if (repo.existsByCustomerUsernameAndCarIdAndStatus(username, car.getId(), PENDING)) {
            throw new IllegalArgumentException("Bạn đã có yêu cầu báo giá đang chờ cho xe này.");
        }
        int quantity = request.getQuantity() == null ? 1 : request.getQuantity();
        if (quantity != 1) {
            throw new IllegalArgumentException("Mỗi phiếu báo giá chỉ áp dụng cho một xe.");
        }
        double listPrice = car.getPrice();
        double finalPrice = promotionService == null
                ? listPrice
                : promotionService.priceAfterPromotion(car.getId(), listPrice);
        double discountAmount = Math.max(0D, listPrice - finalPrice);

        Quotation q = new Quotation();
        q.setCustomerUsername(username);
        q.setCarId(car.getId());
        q.setQuotationDate(new Date());
        q.setCarPrice(listPrice);
        q.setDiscount(discountAmount);
        q.setTotalPrice(finalPrice);
        q.setNote(request.getNote());
        q.setStatus(PENDING);
        q.setUpdatedAt(new Date());
        Quotation saved = repo.save(q);
        saved.setQuotationNo(String.format("BG-%06d", saved.getId()));
        saved = repo.save(saved);

        QuotationItem item = new QuotationItem();
        item.setQuotationId(saved.getId());
        item.setCarId(car.getId());
        item.setQuantity(quantity);
        item.setUnitPrice(listPrice);
        item.setDiscount(discountAmount);
        item.setTotal(finalPrice);
        itemRepo.save(item);
        saved.setTotalPrice(item.getTotal());
        return repo.save(saved);
    }

    @Transactional
    public Quotation update(Integer id, QuotationRequestDto request) {
        Quotation q = get(id);
        Date now = new Date();
        if ((CONVERTED.equals(q.getStatus()) || q.getOrderId() != null)
                && request.getStatus() != null
                && !CONVERTED.equals(request.getStatus())) {
            throw new IllegalArgumentException("Không thể thay đổi trạng thái báo giá đã chuyển thành đơn hàng.");
        }
        double discount = request.getDiscount() == null ? 0D : request.getDiscount();
        if (discount < 0 || discount > q.getCarPrice()) {
            throw new IllegalArgumentException("Giảm giá không hợp lệ.");
        }
        if (request.getStatus() != null
                && !List.of(PENDING, APPROVED, REJECTED).contains(request.getStatus())) {
            throw new IllegalArgumentException("Trạng thái báo giá không hợp lệ.");
        }
        q.setDiscount(discount);
        if (request.getNote() != null) {
            q.setNote(request.getNote());
        }
        if (request.getStatus() != null) {
            if (APPROVED.equals(request.getStatus()) && !APPROVED.equals(q.getStatus())) {
                // Schema không có approved_at; quotationDate là mốc phát hành cố định sau khi duyệt.
                q.setQuotationDate(now);
            }
            q.setStatus(request.getStatus());
        }
        q.setUpdatedAt(now);
        List<QuotationItem> items = itemRepo.findByQuotationIdOrderByIdAsc(id);
        if (!items.isEmpty()) {
            QuotationItem item = items.get(0);
            item.setDiscount(discount);
            item.setTotal(item.getUnitPrice() * item.getQuantity() - discount);
            itemRepo.save(item);
            q.setTotalPrice(item.getTotal());
        } else {
            q.setTotalPrice(q.getCarPrice() - discount);
        }
        return repo.save(q);
    }

    @Transactional
    public Quotation confirm(Integer id, String username) {
        Quotation q = get(id);
        if (!q.getCustomerUsername().equals(username)) {
            throw new IllegalArgumentException("Bạn không có quyền xác nhận báo giá.");
        }
        if (!APPROVED.equals(q.getStatus())) {
            throw new IllegalArgumentException("Báo giá chưa được duyệt, không thể đặt cọc");
        }
        ensureValidForDeposit(q);
        q.setStatus(CONFIRMED);
        return repo.save(q);
    }

    @Transactional
    public Orders convertToOrder(Integer id, String username, QuotationRequestDto request) {
        Quotation q = repo.findForUpdateById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy báo giá."));
        if (!q.getCustomerUsername().equals(username)) {
            throw new IllegalArgumentException("Bạn không có quyền chuyển báo giá này.");
        }
        if (q.getOrderId() != null || CONVERTED.equals(q.getStatus())) {
            throw new IllegalArgumentException("Báo giá đã được chuyển thành đơn hàng.");
        }
        if (!APPROVED.equals(q.getStatus()) && !CONFIRMED.equals(q.getStatus())) {
            throw new IllegalArgumentException("Báo giá chưa được duyệt, không thể đặt cọc");
        }
        if (!CONFIRMED.equals(q.getStatus())) {
            throw new IllegalArgumentException("Khách hàng phải xác nhận báo giá trước khi tạo đơn.");
        }
        ensureValidForDeposit(q);
        if (request == null || !StringUtils.hasText(request.getAddress())) {
            throw new IllegalArgumentException("Vui lòng nhập địa chỉ nhận xe.");
        }
        List<QuotationItem> items = itemRepo.findByQuotationIdOrderByIdAsc(id);
        if (items.isEmpty()) throw new IllegalArgumentException("Báo giá không có sản phẩm.");

        Orders order = new Orders();
        order.setUsername(username);
        order.setCreateDate(new Date());
        order.setAddress(request.getAddress().trim());
        order.setRegistrationAddress(StringUtils.hasText(request.getRegistrationAddress())
                ? request.getRegistrationAddress().trim() : request.getAddress().trim());
        String paymentMethod = StringUtils.hasText(request.getPaymentMethod())
                ? request.getPaymentMethod().trim() : "SePay";
        if (!"SePay".equalsIgnoreCase(paymentMethod)) {
            throw new IllegalArgumentException("Phương thức thanh toán chỉ hỗ trợ QR SePay.");
        }
        order.setPaymentMethod("SePay");
        order.setStatus(OrderStatus.PENDING);
        order.setDepositStatus(OrderStatus.DEPOSIT_UNPAID);
        Orders savedOrder = orderRepo.save(order);

        for (QuotationItem item : items) {
            Car car = carRepo.findForUpdateById(item.getCarId())
                    .orElseThrow(() -> new IllegalArgumentException("Xe trong báo giá không còn tồn tại."));
            int quantity = item.getQuantity() == null ? 0 : item.getQuantity();
            if (quantity != 1) {
                throw new IllegalArgumentException("Mỗi giao dịch đặt cọc chỉ áp dụng cho 01 xe duy nhất");
            }
            if (!"AVAILABLE".equalsIgnoreCase(car.getStatus())) {
                throw new IllegalArgumentException("Xe " + car.getName() + " hiện không khả dụng để đặt cọc.");
            }
            if (car.getStock() == null || car.getStock() < 1) {
                throw new IllegalArgumentException("Xe " + car.getName() + " không đủ tồn kho.");
            }
            car.setStock(car.getStock() - 1);
            car.setStatus(car.getStock() == 0 ? "DEPOSITED" : "AVAILABLE");
            carRepo.save(car);
            OrderDetail detail = new OrderDetail();
            detail.setOrderId(savedOrder.getId());
            detail.setCar(car);
            detail.setPrice(item.getUnitPrice() - item.getDiscount());
            detail.setQuantity(1);
            detailRepo.save(detail);
        }
        q.setOrderId(savedOrder.getId());
        q.setStatus(CONVERTED);
        q.setUpdatedAt(new Date());
        repo.save(q);
        savedOrder.setDepositAmount(q.getTotalPrice() * 0.10D);
        savedOrder = orderRepo.save(savedOrder);
        contractService.createForOrder(savedOrder, q.getTotalPrice());
        return savedOrder;
    }

    private void ensureValidForDeposit(Quotation quotation) {
        Date issuedAt = quotation.getQuotationDate();
        if (issuedAt == null) {
            throw new IllegalArgumentException("Báo giá chưa có ngày phát hành hợp lệ.");
        }
        Calendar expiry = Calendar.getInstance();
        expiry.setTime(issuedAt);
        expiry.add(Calendar.DATE, 7);
        expiry.set(Calendar.HOUR_OF_DAY, 23);
        expiry.set(Calendar.MINUTE, 59);
        expiry.set(Calendar.SECOND, 59);
        expiry.set(Calendar.MILLISECOND, 999);
        if (System.currentTimeMillis() > expiry.getTimeInMillis()) {
            throw new IllegalArgumentException(
                    "Báo giá đã hết hạn hiệu lực (quá 07 ngày). Quý khách vui lòng gửi yêu cầu báo giá mới.");
        }
    }

    public Quotation get(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy báo giá."));
    }

    public List<Quotation> mine(String username) {
        return repo.findByCustomerUsernameOrderByQuotationDateDesc(username);
    }

    public List<Quotation> all() {
        return repo.findAll();
    }

    public List<Quotation> getAll() {
        return all();
    }

    public List<Quotation> getByCustomer(String username) {
        return mine(username);
    }

    public Quotation getById(int id) {
        return get(id);
    }

    @Transactional
    public Quotation createQuotation(String username, Integer carId, Double ignoredCarPrice, String note) {
        QuotationRequestDto request = new QuotationRequestDto();
        request.setCarId(carId);
        request.setNote(note);
        return create(username, request);
    }

    @Transactional
    public Quotation updateDiscountAndStatus(int id, Double discount, String status) {
        QuotationRequestDto request = new QuotationRequestDto();
        request.setDiscount(discount);
        request.setStatus(status);
        return update(id, request);
    }

    @Transactional
    public void deleteQuotation(int id) {
        Quotation quotation = get(id);
        if (quotation.getOrderId() != null || contractService.existsByQuotationId(id)) {
            throw new IllegalArgumentException(
                    "Không thể xóa báo giá đã liên kết với đơn hàng hoặc hợp đồng.");
        }
        List<QuotationItem> items = itemRepo.findByQuotationIdOrderByIdAsc(id);
        if (!items.isEmpty()) {
            itemRepo.deleteAll(items);
            itemRepo.flush();
        }
        repo.delete(quotation);
    }
}
