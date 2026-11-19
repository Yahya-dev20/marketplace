package com.marketplace.catalog_service.controller;

import com.marketplace.catalog_service.dto.ProductRequest;
import com.marketplace.catalog_service.entity.Product;
import com.marketplace.catalog_service.entity.ProductImage;
import com.marketplace.catalog_service.entity.Shop;
import com.marketplace.catalog_service.service.Catalog_service;
import com.marketplace.catalog_service.service.SellerIdentity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/catalog")
public class SellerCatalogController {
    public record StockRequest(@NotNull @Min(0) Integer stock) {}

    private final Catalog_service catalog;
    private final SellerIdentity identity;

    public SellerCatalogController(Catalog_service catalog, SellerIdentity identity) {
        this.catalog = catalog;
        this.identity = identity;
    }

    @GetMapping("/seller/shops")
    public List<Shop> shops(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return catalog.getSellerShops(identity.requireSeller(authorization));
    }

    @GetMapping("/seller/product-ids")
    public List<Long> productIds(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return catalog.getSellerProductIds(identity.requireSeller(authorization));
    }

    @PatchMapping("/seller/products/{id}/stock")
    public Product stock(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                         @PathVariable Long id, @Valid @RequestBody StockRequest request) {
        return catalog.updateStock(id, identity.requireSeller(authorization), request.stock());
    }

    @PostMapping(value = "/seller/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                          @Valid @RequestPart("product") ProductRequest request,
                          @RequestPart(value = "image", required = false) MultipartFile image) {
        long sellerId = identity.requireSeller(authorization);
        catalog.requireShopOwner(request.shopId(), sellerId);
        if (image == null || image.isEmpty()) return catalog.createWithImage(request, sellerId, null, null);
        if (image.getSize() > 5 * 1024 * 1024) throw invalidImage();
        try {
            byte[] content = image.getBytes();
            return catalog.createWithImage(request, sellerId, validateImage(content), content);
        } catch (IOException ex) {
            throw invalidImage();
        }
    }

    @GetMapping("/product-images/{id}")
    public ResponseEntity<byte[]> image(@PathVariable Long id) {
        ProductImage image = catalog.getImage(id);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(image.getContentType()))
            .header("X-Content-Type-Options", "nosniff")
            .body(image.getContent());
    }

    private String validateImage(byte[] content) throws IOException {
        try (ImageInputStream stream = ImageIO.createImageInputStream(new ByteArrayInputStream(content))) {
            if (stream == null) throw invalidImage();
            var readers = ImageIO.getImageReaders(stream);
            if (!readers.hasNext()) throw invalidImage();
            ImageReader reader = readers.next();
            try {
                reader.setInput(stream, true, true);
                String format = reader.getFormatName().toLowerCase(Locale.ROOT);
                if ((!format.equals("jpeg") && !format.equals("png"))
                    || reader.getWidth(0) > 4096 || reader.getHeight(0) > 4096 || reader.read(0) == null) {
                    throw invalidImage();
                }
                return "image/" + format;
            } finally {
                reader.dispose();
            }
        }
    }

    private ResponseStatusException invalidImage() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Image JPEG ou PNG valide, 5 Mo maximum et 4096 pixels par côté");
    }
}
