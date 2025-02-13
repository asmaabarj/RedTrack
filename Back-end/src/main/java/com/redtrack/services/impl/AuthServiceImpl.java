package com.redtrack.services.impl;

import com.redtrack.dtos.auth.AuthResponse;
import com.redtrack.dtos.auth.LoginRequest;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.model.Role;
import com.redtrack.model.User;
import com.redtrack.repositories.RoleRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.security.JwtService;
import com.redtrack.services.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        Role role = roleRepository.findByName(request.getRoleName())
            .orElseThrow(() -> new RuntimeException("Rôle non trouvé"));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPrenom(request.getPrenom());
        user.setNom(request.getNom());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singletonList(role));

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }

}