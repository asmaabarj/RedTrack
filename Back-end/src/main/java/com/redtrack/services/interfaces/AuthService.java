package com.redtrack.services.interfaces;

import com.redtrack.dtos.auth.AuthResponse;
import com.redtrack.dtos.auth.LoginRequest;
import com.redtrack.dtos.auth.UserProfileResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    void logout(String email);
    UserProfileResponse getCurrentUserProfile();
}