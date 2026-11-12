package com.marketplace.cart_service.dto;

import java.math.BigDecimal;

public record CatalogProduct(
    Long id,
    String name,
    BigDecimal price,
    Integer stock
) {}