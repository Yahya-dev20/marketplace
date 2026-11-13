
package com.marketplace.notification_service.service;

import com.marketplace.notification_service.dto.NotificationRequest;
import com.marketplace.notification_service.entity.Notification;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class Notification_service {

    private final Map<Long, Notification> notifications =
            new ConcurrentHashMap<>();

    private final AtomicLong nextId = new AtomicLong(1);

    // Creer une notification
    public Notification create(NotificationRequest request) {

        Long id = nextId.getAndIncrement();

        Notification notification = new Notification(
            id,
            request.userId(),
            request.orderId(),
            request.message(),
            request.type()
        );

        notifications.put(id, notification);

        return notification;
    }

    // Notifications d'un utilisateur
    public List<Notification> getByUser(Long userId) {

        return notifications.values()
            .stream()
            .filter(n -> n.getUserId().equals(userId))
            .sorted(
                Comparator.comparing(Notification::getId)
                    .reversed()
            )
            .toList();
    }

    // Notifications non lues
    public List<Notification> getUnread(Long userId) {

        return getByUser(userId)
            .stream()
            .filter(n -> !n.isRead())
            .toList();
    }

    // Marquer comme lue
    public Notification markAsRead(Long id) {

        Notification notification = notifications.get(id);

        if (notification == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Notification introuvable"
            );
        }

        notification.setRead(true);

        return notification;
    }

    // Supprimer une notification
    public void delete(Long id) {

        Notification removed = notifications.remove(id);

        if (removed == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Notification introuvable"
            );
        }
    }
}
