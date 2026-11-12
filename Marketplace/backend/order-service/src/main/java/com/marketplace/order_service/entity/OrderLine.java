
package com.marketplace.order_service.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Embeddable
public class OrderLine {

    private Long productId;
    private String productName;

    @Column(precision = 12, scale = 2)
    private BigDecimal unitPrice;

    private Integer quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;

    public OrderLine() {}

    public OrderLine(
            Long productId,
            String productName,
            BigDecimal unitPrice,
            Integer quantity,
            BigDecimal subtotal) {

        this.productId = productId;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public Integer getQuantity() { return quantity; }
    public BigDecimal getSubtotal() { return subtotal; }
}
