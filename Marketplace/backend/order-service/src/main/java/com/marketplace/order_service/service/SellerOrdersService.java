package com.marketplace.order_service.service;

import com.marketplace.order_service.dto.OrderLineResponse;
import com.marketplace.order_service.entity.CustomerOrder;
import com.marketplace.order_service.entity.OrderStatus;
import com.marketplace.order_service.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class SellerOrdersService {
    public record SellerOrder(Long id, OrderStatus status, LocalDateTime createdAt,
                              List<OrderLineResponse> items, BigDecimal total) {}
    private record Profile(Long id, String role) {}

    private final OrderRepository orders;
    private final RestClient users;
    private final RestClient catalog;

    public SellerOrdersService(OrderRepository orders,
                               @Value("${user.service.url:http://localhost:8081}") String usersUrl,
                               @Value("${catalog.service.url}") String catalogUrl) {
        this.orders = orders;
        this.users = RestClient.builder().baseUrl(usersUrl).build();
        this.catalog = RestClient.builder().baseUrl(catalogUrl).build();
    }

    @Transactional(readOnly = true)
    public List<SellerOrder> find(String authorization) {
        if (authorization == null) throw unauthorized();
        try {
            Profile profile = users.get().uri("/api/users/seller-auth/session")
                .header(HttpHeaders.AUTHORIZATION, authorization).retrieve().body(Profile.class);
            if (profile == null || profile.id() == null || !"SELLER".equals(profile.role())) throw unauthorized();

            List<Long> products = catalog.get().uri("/api/catalog/seller/product-ids")
                .header(HttpHeaders.AUTHORIZATION, authorization).retrieve()
                .body(new ParameterizedTypeReference<List<Long>>() {});
            if (products == null) throw unavailable();
            Set<Long> productIds = Set.copyOf(products);
            List<CustomerOrder> matching = productIds.isEmpty()
                ? orders.findDistinctByItemsSellerIdOrderByIdDesc(profile.id())
                : orders.findSellerOrders(profile.id(), productIds);
            return matching.stream().map(order -> toResponse(order, profile.id(), productIds)).toList();
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().value() == 401) throw unauthorized();
            throw unavailable();
        } catch (RestClientException ex) {
            throw unavailable();
        }
    }

    private SellerOrder toResponse(CustomerOrder order, Long sellerId, Set<Long> productIds) {
        List<OrderLineResponse> lines = order.getItems().stream()
            .filter(line -> line.getSellerId() == null ? productIds.contains(line.getProductId())
                : sellerId.equals(line.getSellerId()))
            .map(line -> new OrderLineResponse(line.getProductId(), line.getProductName(), line.getUnitPrice(),
                line.getQuantity(), line.getSubtotal()))
            .toList();
        BigDecimal total = lines.stream().map(OrderLineResponse::subtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new SellerOrder(order.getId(), order.getStatus(), order.getCreatedAt(), lines, total);
    }

    private ResponseStatusException unauthorized() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Connexion vendeur requise");
    }

    private ResponseStatusException unavailable() {
        return new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Services utilisateurs ou catalogue indisponibles");
    }
}
