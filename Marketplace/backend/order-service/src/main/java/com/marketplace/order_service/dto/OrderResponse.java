
package com.marketplace.order_service.dto;

import com.marketplace.order_service.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long id,
    Long userId,
    OrderStatus status,
    BigDecimal total,
    LocalDateTime createdAt,
    List<OrderLineResponse> items
) {}
