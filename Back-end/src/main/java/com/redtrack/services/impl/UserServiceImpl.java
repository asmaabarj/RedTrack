package com.redtrack.services.impl;

import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;
import com.redtrack.exceptions.UserException;
import com.redtrack.mappers.UserMapper;
import com.redtrack.model.User;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserException("Cet email est déjà utilisé");
        }



        User user = new User();
        user.setEmail(request.getEmail());
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);
        return new RegisterResponse("Inscription réussie.");
    }

    @Override
    public Page<UserDTO> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::userToUserDTO);
    }

 
}