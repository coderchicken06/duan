package com.example.carstore.util;

import java.util.Set;

public final class OrderStatus {
    public static final String PENDING = "PENDING";          // Khách vừa gửi yêu cầu
    public static final String CONFIRMED = "CONFIRMED";      // Admin đã duyệt, được phép đặt cọc
    public static final String PROCESSING = "PROCESSING";    // Đã cọc, đang chuẩn bị xe
    public static final String DELIVERED = "DELIVERED";
    public static final String CANCELLED = "CANCELLED";

    public static final String DEPOSIT_UNPAID = "UNPAID";
    public static final String DEPOSIT_PAID = "PAID";

    public static final Set<String> VALID_STATUSES = Set.of(
            PENDING, CONFIRMED, PROCESSING, DELIVERED, CANCELLED);

    private OrderStatus() {
    }
}
