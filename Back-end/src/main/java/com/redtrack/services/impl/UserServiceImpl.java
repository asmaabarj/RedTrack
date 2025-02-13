package com.redtrack.services.impl;

import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.UserRoleUpdateDTO;
import com.redtrack.exceptions.UserException;
import com.redtrack.mappers.UserMapper;
import com.redtrack.model.Role;
import com.redtrack.model.User;
import com.redtrack.repositories.RoleRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    @Override
    public Page<UserDTO> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::userToUserDTO);
    }

    @Override
    public UserDTO updateUserRoles(String userId, UserRoleUpdateDTO roleUpdateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("Utilisateur non trouvé"));

        List<Role> newRoles = roleUpdateDTO.getRoleNames().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new UserException("Rôle non trouvé: " + roleName)))
                .collect(Collectors.toList());

        user.setRoles(newRoles);
        User updatedUser = userRepository.save(user);
        return userMapper.userToUserDTO(updatedUser);
    }
}