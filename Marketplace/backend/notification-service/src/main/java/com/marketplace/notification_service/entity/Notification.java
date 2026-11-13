
package com.marketplace.notification_service.entity;

import java.time.LocalDateTime;

public class Notification {

    private Long id;
    private Long userId;
    private Long orderId;
    private String message;
    private NotificationType type;
    private boolean read;
    private LocalDateTime createdAt;

    public Notification(
            Long id,
            Long userId,
            Long orderId,
            String message,
            NotificationType type) {

        this.id = id;
        this.userId = userId;
        this.orderId = orderId;
        this.message = message;
        this.type = type;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getOrderId() { return orderId; }
    public String getMessage() { return message; }
    public NotificationType getType() { return type; }
    public boolean isRead() { return read; }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}
