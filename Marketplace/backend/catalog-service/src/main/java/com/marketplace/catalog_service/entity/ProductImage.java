package com.marketplace.catalog_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    private Long productId;
    @Column(nullable = false, length = 20)
    private String contentType;
    @Column(nullable = false, columnDefinition = "bytea")
    private byte[] content;

    protected ProductImage() {}

    public ProductImage(Long productId, String contentType, byte[] content) {
        this.productId = productId;
        this.contentType = contentType;
        this.content = content;
    }

    public String getContentType() { return contentType; }
    public byte[] getContent() { return content; }
}
