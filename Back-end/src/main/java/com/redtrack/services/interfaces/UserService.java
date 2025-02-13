package com.redtrack.services.interfaces;

import com.redtrack.dtos.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDTO> listUsers(Pageable pageable);
} 