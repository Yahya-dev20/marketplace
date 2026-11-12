package com.marketplace.catalog_service.repository;

import com.marketplace.catalog_service.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> {
}