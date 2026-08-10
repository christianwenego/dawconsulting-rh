package com.dawconsulting.rh.dto;

public record AuthResponse(String token, String tokenType, String fullName, String email, long expiresInMs) {}
