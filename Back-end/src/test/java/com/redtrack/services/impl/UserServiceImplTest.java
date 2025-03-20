package com.redtrack.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;
import com.redtrack.dtos.user.UserDTO;
import com.redtrack.exceptions.UserException;
import com.redtrack.mappers.UserMapper;
import com.redtrack.model.entities.User;
import com.redtrack.model.enums.Role;
import com.redtrack.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("1");
        user.setEmail("test@test.com");
        user.setNom("Test");
        user.setPrenom("User");
        user.setRole(Role.FORMATEUR);
        user.setActive(true);

        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@test.com");
        registerRequest.setPassword("password");
        registerRequest.setNom("Test");
        registerRequest.setPrenom("User");
        registerRequest.setRole(Role.FORMATEUR);
        registerRequest.setClasseIds(new ArrayList<>());

        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void register_Success() {
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        RegisterResponse response = userService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getMessage()).isEqualTo("Inscription réussie.");
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> userService.register(registerRequest))
            .isInstanceOf(UserException.class)
            .hasMessage("Cet email est déjà utilisé");
    }

    @Test
    void listFormateurs_Success() {
        List<User> users = new ArrayList<>();
        users.add(user);
        Page<User> userPage = new PageImpl<>(users);
        
        when(userRepository.findByRoleAndActiveTrueOrderByIdDesc(eq(Role.FORMATEUR), any(Pageable.class)))
            .thenReturn(userPage);
        when(userMapper.userToUserDTO(user)).thenReturn(new UserDTO());

        Page<UserDTO> result = userService.listFormateurs(Pageable.unpaged());

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void archiveUser_Success() {
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        userService.archiveUser("1");

        assertThat(user.getActive()).isFalse();
    }



    @Test
    void getCurrentFormateur_Success() {
        user.setRole(Role.FORMATEUR);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@test.com");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        User result = userService.getCurrentFormateur();

        assertThat(result).isNotNull();
        assertThat(result.getRole()).isEqualTo(Role.FORMATEUR);
    }
} 