
package com.marketplace.catalog_service.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductRequest(
    @NotBlank @Size(max = 255) String name,
    @Size(max = 2000) String description,
    @NotNull @DecimalMin("0.0") @Digits(integer = 10, fraction = 2) BigDecimal price,
    @NotNull @Min(0) Integer stock,
    @NotNull @Positive Long shopId,
    @NotNull @Positive Long categoryId,
    @Size(max = 500)
    @Pattern(regexp = "/products/[A-Za-z0-9_-]+\\.(png|jpg|jpeg|webp)")
    String imageUrl
) {
    public ProductRequest(String name, String description, BigDecimal price, Integer stock,
                          Long shopId, Long categoryId) {
        this(name, description, price, stock, shopId, categoryId, null);
    }
}
