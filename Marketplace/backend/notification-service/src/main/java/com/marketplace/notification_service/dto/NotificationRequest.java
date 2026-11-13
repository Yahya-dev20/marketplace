
package com.marketplace.notification_service.dto;

import com.marketplace.notification_service.entity.NotificationType;
import jakarta.validation.constraints.*;

public record NotificationRequest(
    @NotNull @Positive Long userId,
    @NotNull @Positive Long orderId,
    @NotBlank String message,
    @NotNull NotificationType type
) {}
