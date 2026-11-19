
package com.marketplace.notification_service.service;

import com.marketplace.notification_service.dto.NotificationRequest;
import com.marketplace.notification_service.entity.Notification;
import com.marketplace.notification_service.repository.NotificationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class Notification_service {

    private final NotificationRepository notifications;

    public Notification_service(NotificationRepository notifications) {
        this.notifications = notifications;
    }

    // Creer une notification
    public Notification create(NotificationRequest request) {

        return notifications.save(new Notification(
            request.userId(),
            request.orderId(),
            request.message(),
            request.type()
        ));
    }

    // Notifications d'un utilisateur
    public List<Notification> getByUser(Long userId) {

        return notifications.findByUserIdOrderByIdDesc(userId);
    }

    // Notifications non lues
    public List<Notification> getUnread(Long userId) {

        return notifications.findByUserIdAndReadFalseOrderByIdDesc(userId);
    }

    // Marquer comme lue
    @Transactional
    public Notification markAsRead(Long id) {
        Notification notification = findNotification(id);
        notification.setRead(true);

        return notification;
    }

    // Supprimer une notification
    @Transactional
    public void delete(Long id) {
        notifications.delete(findNotification(id));
    }

    private Notification findNotification(Long id) {
        return notifications.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification introuvable"));
    }
}
