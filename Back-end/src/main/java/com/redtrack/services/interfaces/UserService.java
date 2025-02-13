package com.redtrack.services.interfaces;

import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.UserRoleUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDTO> listUsers(Pageable pageable);
    UserDTO updateUserRoles(String userId, UserRoleUpdateDTO roleUpdateDTO);
} 