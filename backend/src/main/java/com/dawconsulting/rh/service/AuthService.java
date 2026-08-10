package com.dawconsulting.rh.service;

import com.dawconsulting.rh.config.JwtService;
import com.dawconsulting.rh.dto.AuthResponse;
import com.dawconsulting.rh.dto.LoginRequest;
import com.dawconsulting.rh.exception.UnauthorizedException;
import com.dawconsulting.rh.model.AdminUser;
import com.dawconsulting.rh.repository.AdminUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AdminUserRepository adminRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(AdminUserRepository adminRepo, PasswordEncoder encoder, JwtService jwtService) {
        this.adminRepo = adminRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest req) {
        AdminUser user = adminRepo.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new UnauthorizedException("Identifiants invalides."));
        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Identifiants invalides.");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getFullName());
        return new AuthResponse(token, "Bearer", user.getFullName(), user.getEmail(), jwtService.getExpirationMs());
    }
}
