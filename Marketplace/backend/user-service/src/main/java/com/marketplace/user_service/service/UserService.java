
package com.marketplace.user_service.service;

import com.marketplace.user_service.dto.*;
import com.marketplace.user_service.entity.User;
import com.marketplace.user_service.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }

    // Creer un utilisateur
    public UserResponse create(UserRequest request) {

        if (repository.existsByEmail(request.email())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email deja utilise"
            );
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setRole(request.role());

        return toResponse(repository.save(user));
    }

    // Recuperer tous les utilisateurs
    public List<UserResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Recuperer un utilisateur
    public UserResponse findById(Long id) {
        return toResponse(getUser(id));
    }

    private User getUser(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable"
                    )
                );
    }

    // Modifier un utilisateur
    public UserResponse update(Long id, UserRequest request) {
        User user = getUser(id);

        if (!user.getEmail().equals(request.email())
                && repository.existsByEmail(request.email())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email deja utilise"
            );
        }

        user.setName(request.name());
        user.setEmail(request.email());
        user.setRole(request.role());

        return toResponse(repository.save(user));
    }

    // Supprimer un utilisateur
    public void delete(Long id) {
        User user = getUser(id);
        repository.delete(user);
    }
}
