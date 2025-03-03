package com.redtrack.services.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.UpdateUserRequest;
import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;
import com.redtrack.exceptions.ClassException;
import com.redtrack.exceptions.UserException;
import com.redtrack.mappers.UserMapper;
import com.redtrack.model.Class;
import com.redtrack.model.Role;
import com.redtrack.model.User;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.UserService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final ClassRepository classRepository;

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserException("Cet email est déjà utilisé");
        }

        Class classe = classRepository.findById(request.getClasseId())
                .orElseThrow(() -> new ClassException("Classe non trouvée"));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setClasse(classe);

        userRepository.save(user);
        return new RegisterResponse("Inscription réussie.");
    }


    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<UserDTO> listFormateurs(Pageable pageable) {
        Page<UserDTO> formateurs = userRepository.findByRoleAndActiveTrue(Role.FORMATTEUR, pageable)
                .map(userMapper::userToUserDTO);
                
        if (formateurs.isEmpty()) {
            throw new UserException("Il n'existe aucun formateur");
        }
        
        return formateurs;
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<UserDTO> listApprenants(Pageable pageable) {
        Page<UserDTO> apprenants = userRepository.findByRoleAndActiveTrue(Role.APPRENANT, pageable)
                .map(userMapper::userToUserDTO);
                
        if (apprenants.isEmpty()) {
            throw new UserException("Il n'existe aucun apprenant");
        }
        
        return apprenants;
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public void archiveUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("Utilisateur non trouvé"));
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public void unarchiveUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("Utilisateur non trouvé"));
        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public UserDTO updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("Utilisateur non trouvé avec l'ID: " + userId));
                
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserException("Cet email est déjà utilisé");
        }
        
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        
        User updatedUser = userRepository.save(user);
        return userMapper.userToUserDTO(updatedUser);
    }
}