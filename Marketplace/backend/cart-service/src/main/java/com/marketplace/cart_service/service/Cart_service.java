
package com.marketplace.cart_service.service;

import com.marketplace.cart_service.dto.*;
import com.marketplace.cart_service.entity.CartItem;
import com.marketplace.cart_service.repository.CartItemRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class Cart_service {

    private final CartItemRepository repository;
    private final RestClient catalogClient;

    public Cart_service(
            CartItemRepository repository,
            @Value("${catalog.service.url}") String catalogUrl) {

        this.repository = repository;

        this.catalogClient = RestClient.builder()
                .baseUrl(catalogUrl)
                .build();
    }

    // Recuperer un produit depuis Catalog Service
    private CatalogProduct getProduct(Long productId) {
        try {
            CatalogProduct product = catalogClient.get()
                .uri("/api/catalog/products/{id}", productId)
                .retrieve()
                .body(CatalogProduct.class);

            if (product == null || product.price() == null
                    || product.stock() == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Reponse invalide du catalogue"
                );
            }

            return product;

        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Produit introuvable"
            );

        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Catalog Service indisponible"
            );
        }
    }

    // Ajouter un produit au panier
    @Transactional
    public void addItem(Long userId,
                        AddCartItemRequest request) {

        CatalogProduct product = getProduct(request.productId());

        CartItem item = repository
            .findByUserIdAndProductId(userId, request.productId())
            .orElseGet(() -> {
                CartItem newItem = new CartItem();
                newItem.setUserId(userId);
                newItem.setProductId(request.productId());
                newItem.setQuantity(0);
                return newItem;
            });

        long newQuantity =
            (long) item.getQuantity() + request.quantity();

        if (newQuantity > product.stock()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Stock insuffisant"
            );
        }

        item.setQuantity((int) newQuantity);
        repository.save(item);
    }

    // Afficher le panier
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {

        List<CartItemResponse> items = repository
            .findByUserId(userId)
            .stream()
            .map(item -> {
                CatalogProduct product = getProduct(
                    item.getProductId()
                );

                BigDecimal subtotal = product.price()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

                return new CartItemResponse(
                    item.getProductId(),
                    product.name(),
                    product.price(),
                    item.getQuantity(),
                    subtotal
                );
            })
            .toList();

        BigDecimal total = items.stream()
            .map(CartItemResponse::subtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(userId, items, total);
    }

    // Modifier une quantite
    @Transactional
    public void updateQuantity(
            Long userId,
            Long productId,
            UpdateQuantityRequest request) {

        CartItem item = repository
            .findByUserIdAndProductId(userId, productId)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Produit absent du panier"
                )
            );

        CatalogProduct product = getProduct(productId);

        if (request.quantity() > product.stock()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Stock insuffisant"
            );
        }

        item.setQuantity(request.quantity());
        repository.save(item);
    }

    // Supprimer un produit
    @Transactional
    public void removeItem(Long userId, Long productId) {

        CartItem item = repository
            .findByUserIdAndProductId(userId, productId)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Produit absent du panier"
                )
            );

        repository.delete(item);
    }

    // Vider le panier
    @Transactional
    public void clearCart(Long userId) {
        repository.deleteAll(
            repository.findByUserId(userId)
        );
    }
}
