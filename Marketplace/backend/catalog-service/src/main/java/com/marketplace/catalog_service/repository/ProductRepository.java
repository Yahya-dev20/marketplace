package com.marketplace.catalog_service.repository;

import com.marketplace.catalog_service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByShopId(Long shopId);
    List<Product> findByCategoryId(Long categoryId);
}