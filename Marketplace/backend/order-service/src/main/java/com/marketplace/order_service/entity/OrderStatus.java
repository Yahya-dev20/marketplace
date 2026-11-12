package com.marketplace.order_service.entity;

public enum OrderStatus {
    PENDING_PAYMENT,
    PAID,
    PAYMENT_FAILED,
    SHIPPED,
    DELIVERED
}