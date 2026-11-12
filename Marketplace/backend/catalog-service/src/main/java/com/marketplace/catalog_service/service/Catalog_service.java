
package com.marketplace.catalog_service.service;

import com.marketplace.catalog_service.dto.*;
import com.marketplace.catalog_service.entity.*;
import com.marketplace.catalog_service.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class Catalog_service {

    private final ShopRepository shops;
    private final CategoryRepository categories;
    private final ProductRepository products;

    public Catalog_service(
            ShopRepository shops,
            CategoryRepository categories,
            ProductRepository products) {
        this.shops = shops;
        this.categories = categories;
        this.products = products;
    }

    // BOUTIQUES

    public Shop createShop(ShopRequest request) {
        Shop shop = new Shop();
        shop.name = request.name();
        shop.sellerId = request.sellerId();
        return shops.save(shop);
    }

    public List<Shop> getShops() {
        return shops.findAll();
    }

    public Shop getShop(Long id) {
        return shops.findById(id).orElseThrow(() ->
            new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Boutique introuvable"));
    }

    // CATEGORIES

    public Category createCategory(CategoryRequest request) {
        if (categories.existsByNameIgnoreCase(request.name())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Categorie deja existante");
        }

        Category category = new Category();
        category.name = request.name();
        return categories.save(category);
    }

    public List<Category> getCategories() {
        return categories.findAll();
    }

    public Category getCategory(Long id) {
        return categories.findById(id).orElseThrow(() ->
            new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Categorie introuvable"));
    }

    // PRODUITS

    @Transactional
    public Product createProduct(ProductRequest request) {
        Product product = new Product();

        product.name = request.name();
        product.description = request.description();
        product.price = request.price();
        product.stock = request.stock();

        product.shop = getShop(request.shopId());
        product.category = getCategory(request.categoryId());

        return products.save(product);
    }

    public List<Product> getProducts() {
        return products.findAll();
    }

    public Product getProduct(Long id) {
        return products.findById(id).orElseThrow(() ->
            new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Produit introuvable"));
    }

    public List<Product> getProductsByShop(Long shopId) {
        getShop(shopId);
        return products.findByShopId(shopId);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        getCategory(categoryId);
        return products.findByCategoryId(categoryId);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProduct(id);

        product.name = request.name();
        product.description = request.description();
        product.price = request.price();
        product.stock = request.stock();

        product.shop = getShop(request.shopId());
        product.category = getCategory(request.categoryId());

        return products.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProduct(id);
        products.delete(product);
    }
}
