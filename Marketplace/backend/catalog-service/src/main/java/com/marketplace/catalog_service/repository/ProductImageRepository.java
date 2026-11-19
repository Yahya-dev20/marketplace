package com.marketplace.catalog_service.repository;

import com.marketplace.catalog_service.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {}
