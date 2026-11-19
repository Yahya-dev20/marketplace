package com.marketplace.catalog_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class SellerIdentity {
    public record Profile(Long id, String role) {}

    private final RestClient users;

    public SellerIdentity(@Value("${user.service.url:http://localhost:8081}") String url) {
        users = RestClient.builder().baseUrl(url).build();
    }

    public long requireSeller(String authorization) {
        if (authorization == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Connexion vendeur requise");
        }
        try {
            Profile profile = users.get().uri("/api/users/seller-auth/session")
                .header(HttpHeaders.AUTHORIZATION, authorization).retrieve().body(Profile.class);
            if (profile == null || profile.id() == null || !"SELLER".equals(profile.role())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Compte vendeur requis");
            }
            return profile.id();
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().value() == 401) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session vendeur invalide");
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Service utilisateurs indisponible");
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Service utilisateurs indisponible");
        }
    }
}
