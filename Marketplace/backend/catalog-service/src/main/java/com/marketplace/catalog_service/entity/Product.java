
package com.marketplace.catalog_service.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.DynamicUpdate;
import java.math.BigDecimal;

@Entity
@DynamicUpdate
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String name;

    @Column(length = 2000)
    public String description;

    @Column(length = 500)
    public String imageUrl;

    @Column(nullable = false, precision = 12, scale = 2)
    public BigDecimal price;

    @Column(nullable = false)
    public Integer stock;

    @ManyToOne(optional = false)
    @JoinColumn(name = "shop_id")
    public Shop shop;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    public Category category;

    public Product() {}
}
