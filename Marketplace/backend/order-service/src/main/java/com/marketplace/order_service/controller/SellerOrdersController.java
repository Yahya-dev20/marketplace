package com.marketplace.order_service.controller;

import com.marketplace.order_service.service.SellerOrdersService;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders/seller")
public class SellerOrdersController {
    private final SellerOrdersService orders;

    public SellerOrdersController(SellerOrdersService orders) {
        this.orders = orders;
    }

    @GetMapping
    public List<SellerOrdersService.SellerOrder> find(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return orders.find(authorization);
    }
}
