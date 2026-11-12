package com.marketplace.cart_service.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
    Long userId,
    List<CartItemResponse> items,
    BigDecimal total
) {}