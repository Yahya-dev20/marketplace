package com.marketplace.user_service.controller;

import com.marketplace.user_service.dto.UserResponse;
import com.marketplace.user_service.service.SellerAuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/seller-auth")
public class SellerAuthController {
    private final SellerAuthService auth;

    public SellerAuthController(SellerAuthService auth) {
        this.auth = auth;
    }

    public record Registration(@NotBlank @Size(max = 255) String name,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Size(min = 12, max = 128) String password) {}

    public record Credentials(@NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Size(min = 12, max = 128) String password) {}

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public SellerAuthService.Session register(@Valid @RequestBody Registration request) {
        return auth.register(request.name(), request.email(), request.password());
    }

    @PostMapping("/login")
    public SellerAuthService.Session login(@Valid @RequestBody Credentials request) {
        return auth.login(request.email(), request.password());
    }

    @GetMapping("/session")
    public UserResponse session(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return auth.session(authorization);
    }

    @DeleteMapping("/session")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        auth.logout(authorization);
    }
}
