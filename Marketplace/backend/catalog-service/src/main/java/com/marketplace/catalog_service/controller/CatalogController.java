
package com.marketplace.catalog_service.controller;

import com.marketplace.catalog_service.dto.*;
import com.marketplace.catalog_service.entity.*;
import com.marketplace.catalog_service.service.Catalog_service;
import com.marketplace.catalog_service.service.SellerIdentity;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final Catalog_service service;
    private final SellerIdentity identity;

    public CatalogController(Catalog_service service, SellerIdentity identity) {
        this.service = service;
        this.identity = identity;
    }

    // BOUTIQUES

    @PostMapping("/shops")
    @ResponseStatus(HttpStatus.CREATED)
    public Shop createShop(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @Valid @RequestBody ShopRequest request) {
        long sellerId = identity.requireSeller(authorization);
        return service.createShop(new ShopRequest(request.name(), sellerId));
    }

    @GetMapping("/shops")
    public List<Shop> getShops() {
        return service.getShops();
    }

    @GetMapping("/shops/{id}")
    public Shop getShop(@PathVariable Long id) {
        return service.getShop(id);
    }

    // CATEGORIES

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public Category createCategory(
            @Valid @RequestBody CategoryRequest request) {
        return service.createCategory(request);
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return service.getCategories();
    }

    // PRODUITS

    @PostMapping(value = "/products", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @Valid @RequestBody ProductRequest request) {
        service.requireShopOwner(request.shopId(), identity.requireSeller(authorization));
        return service.createProduct(request);
    }

    @GetMapping("/products")
    public List<Product> getProducts() {
        return service.getProducts();
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable Long id) {
        return service.getProduct(id);
    }

    @GetMapping("/shops/{id}/products")
    public List<Product> getShopProducts(@PathVariable Long id) {
        return service.getProductsByShop(id);
    }

    @GetMapping("/categories/{id}/products")
    public List<Product> getCategoryProducts(
            @PathVariable Long id) {
        return service.getProductsByCategory(id);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        long sellerId = identity.requireSeller(authorization);
        service.requireShopOwner(service.getProduct(id).shop.id, sellerId);
        service.requireShopOwner(request.shopId(), sellerId);
        return service.updateProduct(id, request);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                              @PathVariable Long id) {
        long sellerId = identity.requireSeller(authorization);
        service.requireShopOwner(service.getProduct(id).shop.id, sellerId);
        service.deleteProduct(id);
    }
}
