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

    public QuotationService(QuotationRepository repo, CarRepository carRepo,
            QuotationItemRepository itemRepo, OrderRepository orderRepo,
            OrderDetailRepository detailRepo, ContractService contractService) {
        this.repo = repo;
        this.carRepo = carRepo;
        this.itemRepo = itemRepo;
        this.orderRepo = orderRepo;
        this.detailRepo = detailRepo;
        this.contractService = contractService;
    }

    @Transactional
    public Quotation create(String username, QuotationRequestDto request) {
        Car car = carRepo.findById(request.getCarId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe."));
        if (repo.existsByCustomerUsernameAndCarIdAndStatus(username, car.getId(), PENDING)) {
            throw new IllegalArgumentException("Bạn đã có yêu cầu báo giá đang chờ cho xe này.");
        }
        Quotation q = new Quotation();
        q.setCustomerUsername(username);
        q.setCarId(car.getId());
        q.setQuotationDate(new Date());
        q.setCarPrice(car.getPrice());
        q.setDiscount(0D);
        q.setTotalPrice(car.getPrice());
        q.setNote(request.getNote());
        q.setStatus(PENDING);
        q.setUpdatedAt(new Date());
        Quotation saved = repo.save(q);
        saved.setQuotationNo(String.format("BG-%06d", saved.getId()));
        saved = repo.save(saved);

        int quantity = request.getQuantity() == null ? 1 : request.getQuantity();
        if (quantity < 1 || quantity > 10) {
            throw new IllegalArgumentException("Số lượng xe phải từ 1 đến 10.");
        }
        QuotationItem item = new QuotationItem();
        item.setQuotationId(saved.getId());
        item.setCarId(car.getId());
        item.setQuantity(quantity);
        item.setUnitPrice(car.getPrice());
        item.setDiscount(0D);
        item.setTotal(car.getPrice() * quantity);
        itemRepo.save(item);
        saved.setTotalPrice(item.getTotal());
        return repo.save(saved);
    }

    @Transactional
    public Quotation update(Integer id, QuotationRequestDto request) {
        Quotation q = get(id);
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
            q.setStatus(request.getStatus());
        }
        q.setUpdatedAt(new Date());
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
            throw new IllegalArgumentException("Báo giá chưa được duyệt.");
        }
        q.setStatus(CONFIRMED);
        q.setUpdatedAt(new Date());
        return repo.save(q);
    }

    @Transactional
    public Orders convertToOrder(Integer id, String username, QuotationRequestDto request) {
        Quotation q = get(id);
        if (!q.getCustomerUsername().equals(username)) {
            throw new IllegalArgumentException("Bạn không có quyền chuyển báo giá này.");
        }
        if (q.getOrderId() != null || CONVERTED.equals(q.getStatus())) {
            throw new IllegalArgumentException("Báo giá đã được chuyển thành đơn hàng.");
        }
        if (!CONFIRMED.equals(q.getStatus())) {
            throw new IllegalArgumentException("Khách hàng phải xác nhận báo giá trước khi tạo đơn.");
        }
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
        order.setPaymentMethod(StringUtils.hasText(request.getPaymentMethod())
                ? request.getPaymentMethod().trim() : "VNPay");
        order.setStatus(OrderStatus.PENDING);
        order.setDepositStatus(OrderStatus.DEPOSIT_UNPAID);
        Orders savedOrder = orderRepo.save(order);

        for (QuotationItem item : items) {
            Car car = carRepo.findForUpdateById(item.getCarId())
                    .orElseThrow(() -> new IllegalArgumentException("Xe trong báo giá không còn tồn tại."));
            int quantity = item.getQuantity() == null ? 0 : item.getQuantity();
            if (quantity < 1 || car.getStock() == null || car.getStock() < quantity) {
                throw new IllegalArgumentException("Xe " + car.getName() + " không đủ tồn kho.");
            }
            car.setStock(car.getStock() - quantity);
            carRepo.save(car);
            OrderDetail detail = new OrderDetail();
            detail.setOrderId(savedOrder.getId());
            detail.setCar(car);
            detail.setPrice((item.getUnitPrice() * quantity - item.getDiscount()) / quantity);
            detail.setQuantity(quantity);
            detailRepo.save(detail);
        }
        q.setOrderId(savedOrder.getId());
        q.setStatus(CONVERTED);
        q.setUpdatedAt(new Date());
        repo.save(q);
        contractService.createForOrder(savedOrder, q.getTotalPrice());
        return savedOrder;
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
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy báo giá.");
        }
        repo.deleteById(id);
    }
}
