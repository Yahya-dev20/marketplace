
package com.marketplace.catalog_service.controller;

import com.marketplace.catalog_service.dto.*;
import com.marketplace.catalog_service.entity.*;
import com.marketplace.catalog_service.service.Catalog_service;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final Catalog_service service;

    public CatalogController(Catalog_service service) {
        this.service = service;
    }

    // BOUTIQUES

    @PostMapping("/shops")
    @ResponseStatus(HttpStatus.CREATED)
    public Shop createShop(
            @Valid @RequestBody ShopRequest request) {
        return service.createShop(request);
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

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(
            @Valid @RequestBody ProductRequest request) {
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
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return service.updateProduct(id, request);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
    }
}
