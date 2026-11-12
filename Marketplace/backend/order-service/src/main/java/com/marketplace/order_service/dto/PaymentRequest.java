package com.marketplace.order_service.dto;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
    @NotNull Boolean success
) {}