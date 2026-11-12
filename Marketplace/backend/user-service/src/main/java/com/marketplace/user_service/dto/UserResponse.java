
package com.marketplace.user_service.dto;

import com.marketplace.user_service.entity.Role;

public record UserResponse(
    Long id,
    String name,
    String email,
    Role role
) {}
