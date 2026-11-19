package com.marketplace.catalog_service.repository;

import com.marketplace.catalog_service.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    List<Shop> findBySellerIdOrderById(Long sellerId);
}
