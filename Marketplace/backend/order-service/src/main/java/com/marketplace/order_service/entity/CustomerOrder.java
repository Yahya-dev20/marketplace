
package com.marketplace.order_service.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer_orders")
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "order_lines",
        joinColumns = @JoinColumn(name = "order_id")
    )
    private List<OrderLine> items = new ArrayList<>();

    public CustomerOrder() {}

    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long value) { userId = value; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus value) { status = value; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal value) { total = value; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime value) {
        createdAt = value;
    }

    public List<OrderLine> getItems() { return items; }

    public void setItems(List<OrderLine> value) {
        items = value;
    }
}
