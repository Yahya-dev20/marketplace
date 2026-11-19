
package com.marketplace.order_service.repository;

import com.marketplace.order_service.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Collection;
import java.util.List;

public interface OrderRepository
        extends JpaRepository<CustomerOrder, Long> {

    // Recuperer les commandes d'un utilisateur
    List<CustomerOrder> findByUserId(Long userId);

    List<CustomerOrder> findDistinctByItemsSellerIdOrderByIdDesc(Long sellerId);

    @Query("""
        select distinct o from CustomerOrder o join o.items line
        where line.sellerId = :sellerId or (line.sellerId is null and line.productId in :productIds)
        order by o.id desc
        """)
    List<CustomerOrder> findSellerOrders(Long sellerId, Collection<Long> productIds);
}
