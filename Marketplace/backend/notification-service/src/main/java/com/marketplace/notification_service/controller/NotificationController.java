
package com.marketplace.notification_service.controller;

import com.marketplace.notification_service.dto.NotificationRequest;
import com.marketplace.notification_service.entity.Notification;
import com.marketplace.notification_service.service.Notification_service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/notifications")
public class NotificationController {

    private final Notification_service service;

    public NotificationController(Notification_service service) {
        this.service = service;
    }

    // Creer une notification
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification create(
            @Valid @RequestBody NotificationRequest request) {

        return service.create(request);
    }

    // Consulter les notifications d'un client
    @GetMapping("/users/{userId}")
    public List<Notification> getByUser(
            @PathVariable @Positive Long userId) {

        return service.getByUser(userId);
    }

    // Consulter les notifications non lues
    @GetMapping("/users/{userId}/unread")
    public List<Notification> getUnread(
            @PathVariable @Positive Long userId) {

        return service.getUnread(userId);
    }

    // Marquer une notification comme lue
    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable @Positive Long id) {

        return service.markAsRead(id);
    }

    // Supprimer une notification
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable @Positive Long id) {

        service.delete(id);
    }
}
