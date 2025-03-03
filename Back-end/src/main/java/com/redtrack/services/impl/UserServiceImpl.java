package com.redtrack.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.UpdateUserRequest;
import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;
import com.redtrack.dtos.CreateApprenantRequest;
import com.redtrack.dtos.UpdateApprenantRequest;
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

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

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
        Page<UserDTO> formateurs = userRepository.findByRoleAndActiveTrue(Role.FORMATEUR, pageable)
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

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public Page<UserDTO> getFormateurClassApprenants(Pageable pageable) {
        User formateur = getCurrentFormateur();
        if (formateur.getClasse() == null) {
            throw new UserException("Aucune classe assignée à ce formateur");
        }
        return userRepository.findByClasseAndRoleAndActiveTrue(formateur.getClasse(), Role.APPRENANT, pageable)
                .map(userMapper::userToUserDTO);
    }


    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public void archiveApprenantByFormateur(String apprenantId) {
        User formateur = getCurrentFormateur();
        User apprenant = userRepository.findById(apprenantId)
                .orElseThrow(() -> new UserException("Apprenant non trouvé"));

        if (!formateur.getClasse().getId().equals(apprenant.getClasse().getId())) {
            throw new UserException("Cet apprenant n'appartient pas à votre classe");
        }

        apprenant.setActive(false);
        userRepository.save(apprenant);
    }

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public void unarchiveApprenantByFormateur(String apprenantId) {
        User formateur = getCurrentFormateur();
        User apprenant = userRepository.findById(apprenantId)
                .orElseThrow(() -> new UserException("Apprenant non trouvé"));

        if (!formateur.getClasse().getId().equals(apprenant.getClasse().getId())) {
            throw new UserException("Cet apprenant n'appartient pas à votre classe");
        }

        apprenant.setActive(true);
        userRepository.save(apprenant);
    }

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public UserDTO createApprenantInFormateurClass(CreateApprenantRequest request) {
        User formateur = getCurrentFormateur();
        
        if (formateur.getClasse() == null) {
            throw new UserException("Aucune classe assignée à ce formateur");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserException("Cet email est déjà utilisé");
        }

        User apprenant = new User();
        apprenant.setEmail(request.getEmail());
        apprenant.setPassword(passwordEncoder.encode(request.getPassword()));
        apprenant.setNom(request.getNom());
        apprenant.setPrenom(request.getPrenom());
        apprenant.setRole(Role.APPRENANT);
        apprenant.setClasse(formateur.getClasse());
        apprenant.setActive(true);

        return userMapper.userToUserDTO(userRepository.save(apprenant));
    }

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public UserDTO updateApprenantByFormateur(String apprenantId, UpdateApprenantRequest request) {
        User formateur = getCurrentFormateur();
        User apprenant = userRepository.findById(apprenantId)
                .orElseThrow(() -> new UserException("Apprenant non trouvé"));

        if (formateur.getClasse() == null || 
            apprenant.getClasse() == null || 
            !formateur.getClasse().getId().equals(apprenant.getClasse().getId())) {
            throw new UserException("Cet apprenant n'appartient pas à votre classe");
        }

        if (!apprenant.getEmail().equals(request.getEmail()) && 
            userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserException("Cet email est déjà utilisé");
        }

        apprenant.setEmail(request.getEmail());
        apprenant.setNom(request.getNom());
        apprenant.setPrenom(request.getPrenom());

        return userMapper.userToUserDTO(userRepository.save(apprenant));
    }

    private User getCurrentFormateur() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User formateur = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException("Formateur non trouvé"));

        if (formateur.getRole() != Role.FORMATEUR) {
            throw new UserException("L'utilisateur n'est pas un formateur");
        }

        return formateur;
    }
}