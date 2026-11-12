package com.marketplace.order_service.dto;

import java.math.BigDecimal;

public record CatalogProduct(
    Long id,
    String name,
    BigDecimal price,
    Integer stock
) {}