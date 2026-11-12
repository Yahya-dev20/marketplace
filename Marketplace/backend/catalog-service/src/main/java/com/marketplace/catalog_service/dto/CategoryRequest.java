package com.marketplace.catalog_service.dto;

import jakarta.validation.constraints.*;

public record CategoryRequest(
    @NotBlank String name
) {}