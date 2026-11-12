package com.marketplace.catalog_service.dto;

import jakarta.validation.constraints.*;

public record ShopRequest(
    @NotBlank String name,
    @NotNull @Positive Long sellerId
) {}