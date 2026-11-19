package com.marketplace.order_service.dto;

import java.math.BigDecimal;

public record CatalogProduct(
    Long id,
    String name,
    BigDecimal price,
    Integer stock,
    Shop shop
) {
    public record Shop(Long sellerId) {}

    public CatalogProduct(Long id, String name, BigDecimal price, Integer stock) {
        this(id, name, price, stock, null);
    }
}
