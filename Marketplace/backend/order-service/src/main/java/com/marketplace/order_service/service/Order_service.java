
package com.marketplace.order_service.service;

import com.marketplace.order_service.dto.*;
import com.marketplace.order_service.entity.*;
import com.marketplace.order_service.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class Order_service {

    private final OrderRepository repository;
    private final RestClient cartClient;
    private final RestClient catalogClient;

    public Order_service(
            OrderRepository repository,
            @Value("${cart.service.url}") String cartUrl,
            @Value("${catalog.service.url}") String catalogUrl) {

        this.repository = repository;
        this.cartClient = RestClient.builder()
                .baseUrl(cartUrl).build();
        this.catalogClient = RestClient.builder()
                .baseUrl(catalogUrl).build();
    }

    // Convertir une commande en reponse API
    private OrderResponse toResponse(CustomerOrder order) {

        List<OrderLineResponse> lines = order.getItems()
            .stream()
            .map(line -> new OrderLineResponse(
                line.getProductId(),
                line.getProductName(),
                line.getUnitPrice(),
                line.getQuantity(),
                line.getSubtotal()
            ))
            .toList();

        return new OrderResponse(
            order.getId(),
            order.getUserId(),
            order.getStatus(),
            order.getTotal(),
            order.getCreatedAt(),
            lines
        );
    }

    // Recuperer le panier du client
    private CartResponse getCart(Long userId) {
        try {
            CartResponse cart = cartClient.get()
                .uri("/api/carts/{userId}", userId)
                .retrieve()
                .body(CartResponse.class);

            if (cart == null || cart.items() == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Reponse invalide de Cart Service"
                );
            }

            return cart;
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Cart Service indisponible"
            );
        }
    }

    // Recuperer un produit du catalogue
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
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Catalog Service indisponible"
            );
        }
    }

    // Creer une commande depuis le panier
    @Transactional
    public OrderResponse createOrder(Long userId) {

        CartResponse cart = getCart(userId);

        if (cart.items().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Le panier est vide"
            );
        }

        List<OrderLine> lines = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItemResponse item : cart.items()) {

            CatalogProduct product = getProduct(
                item.productId()
            );

            if (item.quantity() == null || item.quantity() <= 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantite invalide"
                );
            }

            if (product.stock() < item.quantity()) {
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Stock insuffisant : " + product.name()
                );
            }

            if (product.price().signum() < 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Prix invalide dans le catalogue"
                );
            }

            BigDecimal subtotal = product.price()
                .multiply(BigDecimal.valueOf(item.quantity()));

            lines.add(new OrderLine(
                product.id(),
                product.name(),
                product.price(),
                item.quantity(),
                subtotal
            ));

            total = total.add(subtotal);
        }

        CustomerOrder order = new CustomerOrder();
        order.setUserId(userId);
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setTotal(total);
        order.setCreatedAt(LocalDateTime.now());
        order.setItems(lines);

        return toResponse(repository.save(order));
    }

    // Consulter une commande
    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long id) {
        return toResponse(findOrder(id));
    }

    private CustomerOrder findOrder(Long id) {
        return repository.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Commande introuvable"
                )
            );
    }

    // Historique des commandes
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        return repository.findByUserId(userId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    // Paiement simule
    @Transactional
    public OrderResponse simulatePayment(
            Long orderId, boolean success) {

        CustomerOrder order = findOrder(orderId);

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Paiement deja traite"
            );
        }

        order.setStatus(success
            ? OrderStatus.PAID
            : OrderStatus.PAYMENT_FAILED);

        return toResponse(repository.save(order));
    }

    // Expedition de la commande
    @Transactional
    public OrderResponse shipOrder(Long orderId) {

        CustomerOrder order = findOrder(orderId);

        if (order.getStatus() != OrderStatus.PAID) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "La commande doit etre payee"
            );
        }

        order.setStatus(OrderStatus.SHIPPED);
        return toResponse(repository.save(order));
    }

    // Livraison de la commande
    @Transactional
    public OrderResponse deliverOrder(Long orderId) {

        CustomerOrder order = findOrder(orderId);

        if (order.getStatus() != OrderStatus.SHIPPED) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "La commande doit etre expediee"
            );
        }

        order.setStatus(OrderStatus.DELIVERED);
        return toResponse(repository.save(order));
    }
}
