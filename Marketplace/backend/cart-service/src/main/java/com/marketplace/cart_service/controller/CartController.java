
package com.marketplace.cart_service.controller;

import com.marketplace.cart_service.dto.*;
import com.marketplace.cart_service.service.Cart_service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequestMapping("/api/carts")
public class CartController {

    private final Cart_service service;

    public CartController(Cart_service service) {
        this.service = service;
    }

    // Ajouter un produit
    @PostMapping("/{userId}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addItem(
            @PathVariable @Positive Long userId,
            @Valid @RequestBody AddCartItemRequest request) {

        service.addItem(userId, request);
        return service.getCart(userId);
    }

    // Consulter le panier
    @GetMapping("/{userId}")
    public CartResponse getCart(
            @PathVariable @Positive Long userId) {

        return service.getCart(userId);
    }

    // Modifier la quantite
    @PutMapping("/{userId}/items/{productId}")
    public CartResponse updateQuantity(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long productId,
            @Valid @RequestBody UpdateQuantityRequest request) {

        service.updateQuantity(userId, productId, request);
        return service.getCart(userId);
    }

    // Supprimer un produit
    @DeleteMapping("/{userId}/items/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long productId) {

        service.removeItem(userId, productId);
    }

    // Vider le panier
    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(
            @PathVariable @Positive Long userId) {

        service.clearCart(userId);
    }
}
