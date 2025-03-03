package com.redtrack.services.interfaces;

import com.redtrack.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.redtrack.dtos.CreateApprenantRequest;
import com.redtrack.dtos.UpdateApprenantRequest;
import com.redtrack.dtos.UpdateUserRequest;
import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;

public interface UserService {
    RegisterResponse register(RegisterRequest request);


    Page<UserDTO> listFormateurs(Pageable pageable);
    Page<UserDTO> listApprenants(Pageable pageable);

    void archiveUser(String userId);
    void unarchiveUser(String userId);

    UserDTO updateUser(String userId, UpdateUserRequest request);

    Page<UserDTO> getFormateurClassApprenants(Pageable pageable);
    UserDTO createApprenantInFormateurClass(CreateApprenantRequest request);
    void archiveApprenantByFormateur(String apprenantId);
    void unarchiveApprenantByFormateur(String apprenantId);

    UserDTO updateApprenantByFormateur(String apprenantId, UpdateApprenantRequest request);

    User getCurrentFormateur();
} 