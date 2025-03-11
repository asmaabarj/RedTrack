package com.redtrack.services.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.auth.AuthResponse;
import com.redtrack.dtos.auth.LoginRequest;
import com.redtrack.dtos.auth.UserProfileResponse;
import com.redtrack.exceptions.AlreadyLoggedInException;
import com.redtrack.exceptions.UserException;
import com.redtrack.model.entities.User;
import com.redtrack.repositories.UserRepository;
import com.redtrack.security.JwtService;
import com.redtrack.security.SessionManager;
import com.redtrack.services.interfaces.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final SessionManager sessionManager;



    @Override
    public AuthResponse login(LoginRequest request) {
        if (sessionManager.isSessionActive(request.getEmail())) {
            throw new AlreadyLoggedInException("Vous êtes déjà connecté. Déconnectez-vous d'abord.");
        }

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UserException("Utilisateur non trouvé"));

        if (!user.getActive()) {
            throw new UserException("Votre compte a été désactivé. Veuillez contacter l'administrateur.");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        sessionManager.addSession(user.getEmail());
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getRole().name());
    }

    @Override
    public void logout(String email) {
        sessionManager.removeSession(email);
    }

    @Override
    public UserProfileResponse getCurrentUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserException("Utilisateur non trouvé"));
            
        return new UserProfileResponse(
            user.getEmail(),
            user.getNom(),
            user.getPrenom()
        );
    }

    @Override
    public void invalidateToken(String token) {
        String email = jwtService.extractUsername(token);
        if (email != null) {
            sessionManager.removeSession(email);
        }
    }

}