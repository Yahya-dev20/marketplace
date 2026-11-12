package com.marketplace.cart_service.dto;

import jakarta.validation.constraints.*;

public record AddCartItemRequest(
    @NotNull @Positive Long productId,
    @NotNull @Positive Integer quantity
) {}