package com.dawconsulting.rh.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone,
        String company,
        @NotBlank String message
) {}
