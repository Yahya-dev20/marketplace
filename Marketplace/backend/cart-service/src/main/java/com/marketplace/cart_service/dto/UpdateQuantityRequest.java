package com.marketplace.cart_service.dto;

import jakarta.validation.constraints.*;

public record UpdateQuantityRequest(
    @NotNull @Positive Integer quantity
) {}