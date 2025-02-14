package com.redtrack.services.interfaces;

import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    RegisterResponse register(RegisterRequest request);

    Page<UserDTO> listUsers(Pageable pageable);
} 