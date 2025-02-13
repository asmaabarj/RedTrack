package com.redtrack.services.impl;

import com.redtrack.dtos.auth.AuthResponse;
import com.redtrack.dtos.auth.LoginRequest;
import com.redtrack.model.User;
import com.redtrack.repositories.UserRepository;
import com.redtrack.security.JwtService;
import com.redtrack.services.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import com.redtrack.exceptions.UserException;
import com.redtrack.security.SessionManager;
import com.redtrack.exceptions.AlreadyLoggedInException;

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

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UserException("Utilisateur non trouvé"));
        
        sessionManager.addSession(user.getEmail());
        return new AuthResponse(jwtService.generateToken(user));
    }

    @Override
    public void logout(String email) {
        sessionManager.removeSession(email);
    }

}