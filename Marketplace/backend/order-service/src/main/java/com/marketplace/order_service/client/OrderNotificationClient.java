
package com.marketplace.order_service.client;

import com.marketplace.order_service.entity.CustomerOrder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class OrderNotificationClient {

    private static final Logger log =
        LoggerFactory.getLogger(OrderNotificationClient.class);

    private final RestClient client;

    public OrderNotificationClient(
            @Value("${notification.service.url}") String url) {

        this.client = RestClient.builder()
            .baseUrl(url)
            .build();
    }

    public void sendAfterCommit(
            CustomerOrder order,
            String type,
            String message) {

        // Envoyer seulement apres validation de la transaction
        if (!TransactionSynchronizationManager
                .isActualTransactionActive()
            || !TransactionSynchronizationManager
                .isSynchronizationActive()) {
            throw new IllegalStateException(
                "Transaction active requise"
            );
        }

        TransactionSynchronizationManager.registerSynchronization(
            new TransactionSynchronization() {

                @Override
                public void afterCommit() {

                    try {
                        client.post()
                            .uri("/api/notifications")
                            .body(Map.of(
                                "userId", order.getUserId(),
                                "orderId", order.getId(),
                                "message", message,
                                "type", type
                            ))
                            .retrieve()
                            .toBodilessEntity();

                    } catch (Exception ex) {
                        log.warn(
                            "Notification non envoyee pour commande {}",
                            order.getId(),
                            ex
                        );
                    }
                }
            }
        );
    }
}
