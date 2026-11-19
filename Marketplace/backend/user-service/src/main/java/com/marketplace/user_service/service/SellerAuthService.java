package com.marketplace.user_service.service;

import com.marketplace.user_service.dto.UserResponse;
import com.marketplace.user_service.entity.Role;
import com.marketplace.user_service.entity.User;
import com.marketplace.user_service.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

@Service
public class SellerAuthService {
    public record Session(String token, UserResponse seller) {}

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();
    private final UserRepository users;

    public SellerAuthService(UserRepository users) {
        this.users = users;
    }

    @Transactional
    public Session register(String name, String email, String password) {
        String normalized = email.toLowerCase(Locale.ROOT);
        if (users.findByEmailIgnoreCase(normalized).isPresent()) throw emailConflict();
        User seller = new User();
        seller.setName(name.strip());
        seller.setEmail(normalized);
        seller.setRole(Role.SELLER);
        byte[] salt = randomBytes(16);
        seller.setPasswordHash(ENCODER.encodeToString(salt) + ":" + ENCODER.encodeToString(derive(password, salt)));
        try {
            return issueSession(seller);
        } catch (DataIntegrityViolationException duplicate) {
            throw emailConflict();
        }
    }

    @Transactional
    public Session login(String email, String password) {
        User seller = users.findByEmailIgnoreCase(email).orElse(null);
        String stored = seller != null && seller.getRole() == Role.SELLER ? seller.getPasswordHash() : null;
        String[] parts = stored == null ? null : stored.split(":", 2);
        byte[] salt = parts == null ? new byte[16] : DECODER.decode(parts[0]);
        byte[] expected = parts == null ? new byte[32] : DECODER.decode(parts[1]);
        if (!MessageDigest.isEqual(derive(password, salt), expected) || stored == null) throw unauthorized();
        return issueSession(seller);
    }

    public UserResponse session(String authorization) {
        return response(findSession(authorization));
    }

    @Transactional
    public void logout(String authorization) {
        findSession(authorization).setSellerSession(null, null);
    }

    private Session issueSession(User seller) {
        String token = ENCODER.encodeToString(randomBytes(32));
        seller.setSellerSession(hashToken(token), Instant.now().plus(Duration.ofHours(8)));
        return new Session(token, response(users.saveAndFlush(seller)));
    }

    private User findSession(String authorization) {
        if (authorization == null || !authorization.matches("Bearer [A-Za-z0-9_-]{43}")) throw unauthorized();
        return users.findBySellerTokenHash(hashToken(authorization.substring(7)))
            .filter(user -> user.getRole() == Role.SELLER && user.getSellerTokenExpiresAt() != null
                && user.getSellerTokenExpiresAt().isAfter(Instant.now()))
            .orElseThrow(SellerAuthService::unauthorized);
    }

    private static UserResponse response(User seller) {
        return new UserResponse(seller.getId(), seller.getName(), seller.getEmail(), seller.getRole());
    }

    private static byte[] randomBytes(int length) {
        byte[] bytes = new byte[length];
        RANDOM.nextBytes(bytes);
        return bytes;
    }

    private static byte[] derive(String password, byte[] salt) {
        PBEKeySpec key = new PBEKeySpec(password.toCharArray(), salt, 310_000, 256);
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(key).getEncoded();
        } catch (GeneralSecurityException ex) {
            throw new IllegalStateException("Hachage indisponible", ex);
        } finally {
            key.clearPassword();
        }
    }

    private static String hashToken(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                .digest(token.getBytes(StandardCharsets.US_ASCII)));
        } catch (GeneralSecurityException ex) {
            throw new IllegalStateException("Hachage indisponible", ex);
        }
    }

    private static ResponseStatusException unauthorized() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants ou session invalides");
    }

    private static ResponseStatusException emailConflict() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Adresse e-mail déjà utilisée");
    }
}
