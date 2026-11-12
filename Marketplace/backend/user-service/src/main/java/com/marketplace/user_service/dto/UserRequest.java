
package com.marketplace.user_service.dto;

import com.marketplace.user_service.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequest(
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotNull Role role
) {}
