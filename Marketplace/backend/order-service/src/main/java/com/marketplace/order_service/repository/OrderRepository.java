
package com.marketplace.order_service.repository;

import com.marketplace.order_service.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository
        extends JpaRepository<CustomerOrder, Long> {

    // Recuperer les commandes d'un utilisateur
    List<CustomerOrder> findByUserId(Long userId);
}
