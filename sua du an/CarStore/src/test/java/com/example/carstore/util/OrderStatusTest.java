package com.example.carstore.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OrderStatusTest {

    @Test
    void acceptsOnlyDeclaredBusinessStatuses() {
        assertTrue(OrderStatus.VALID_STATUSES.contains(OrderStatus.PENDING));
        assertTrue(OrderStatus.VALID_STATUSES.contains(OrderStatus.PROCESSING));
        assertFalse(OrderStatus.VALID_STATUSES.contains("UNKNOWN"));
    }
}
