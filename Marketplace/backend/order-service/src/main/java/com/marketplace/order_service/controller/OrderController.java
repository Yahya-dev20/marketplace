
package com.marketplace.order_service.controller;

import com.marketplace.order_service.dto.*;
import com.marketplace.order_service.service.Order_service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/orders")
public class OrderController {

    private final Order_service service;

    public OrderController(Order_service service) {
        this.service = service;
    }

    // Creer une commande depuis un panier
    @PostMapping("/checkout/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(
            @PathVariable @Positive Long userId) {
        return service.createOrder(userId);
    }

    // Consulter une commande
    @GetMapping("/{id}")
    public OrderResponse getOrder(
            @PathVariable @Positive Long id) {
        return service.getOrder(id);
    }

    // Historique d'un client
    @GetMapping("/users/{userId}")
    public List<OrderResponse> getUserOrders(
            @PathVariable @Positive Long userId) {
        return service.getUserOrders(userId);
    }

    // Simuler un paiement
    @PostMapping("/{id}/payment")
    public OrderResponse payment(
            @PathVariable @Positive Long id,
            @Valid @RequestBody PaymentRequest request) {
        return service.simulatePayment(id, request.success());
    }

    // Expedier une commande
    @PutMapping("/{id}/ship")
    public OrderResponse ship(
            @PathVariable @Positive Long id) {
        return service.shipOrder(id);
    }

    // Marquer comme livree
    @PutMapping("/{id}/deliver")
    public OrderResponse deliver(
            @PathVariable @Positive Long id) {
        return service.deliverOrder(id);
    }
}
