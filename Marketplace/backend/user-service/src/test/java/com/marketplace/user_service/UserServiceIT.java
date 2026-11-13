
package com.marketplace.user_service;

import com.marketplace.user_service.entity.Role;
import com.marketplace.user_service.entity.User;
import com.marketplace.user_service.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserServiceIT {

    @Autowired
    private UserRepository repository;

    @Test
    void shouldSaveAndFindUser() {

        // 1. Creer un utilisateur
        User user = new User();
        user.setName("Integration Test");
        user.setEmail(
            "test-" + UUID.randomUUID() + "@example.com"
        );
        user.setRole(Role.CUSTOMER);

        // 2. Enregistrer dans PostgreSQL
        User saved = repository.saveAndFlush(user);

        // 3. Recuperer depuis PostgreSQL
        User found = repository.findById(
            saved.getId()
        ).orElseThrow();

        // 4. Verifier le resultat
        assertNotNull(found.getId());
        assertEquals("Integration Test", found.getName());
        assertEquals(Role.CUSTOMER, found.getRole());
    }
}
