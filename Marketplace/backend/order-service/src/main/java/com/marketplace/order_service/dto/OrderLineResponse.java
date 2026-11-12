package com.marketplace.order_service.dto;

import java.math.BigDecimal;

public record OrderLineResponse(
    Long productId,
    String productName,
    BigDecimal unitPrice,
    Integer quantity,
    BigDecimal subtotal
) {}