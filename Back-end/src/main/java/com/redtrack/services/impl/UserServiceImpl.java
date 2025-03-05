package com.redtrack.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.ClassDTO;
import com.redtrack.dtos.CreateApprenantRequest;
import com.redtrack.dtos.UpdateApprenantRequest;
import com.redtrack.dtos.UpdateUserRequest;
import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;
import com.redtrack.exceptions.ClassException;
import com.redtrack.exceptions.UserException;
import com.redtrack.mappers.ClassMapper;
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
    private final ClassMapper classMapper;

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserException("Cet email est déjà utilisé");
        }

        List<Class> classes = request.getClasseIds().stream()
                .map(id -> classRepository.findById(id)
                        .orElseThrow(() -> new ClassException("Classe non trouvée avec l'ID: " + id)))
                .collect(Collectors.toList());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.getClasses().addAll(classes);

        User savedUser = userRepository.save(user);
        
        // Ajouter l'utilisateur à toutes les classes
        classes.forEach(classe -> {
            classe.getUsers().add(savedUser);
            classRepository.save(classe);
        });

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
        List<Class> classes = classRepository.findByUsersContaining(formateur);
        
        if (classes.isEmpty()) {
            throw new UserException("Aucune classe assignée à ce formateur");
        }

        Class classe = classes.get(0);  // On prend la première classe
        return userRepository.findByClassesContainingAndRoleAndActiveTrue(classe, Role.APPRENANT, pageable)
                .map(userMapper::userToUserDTO);
    }


    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public void archiveApprenantByFormateur(String apprenantId) {
        User formateur = getCurrentFormateur();
        User apprenant = userRepository.findById(apprenantId)
                .orElseThrow(() -> new UserException("Apprenant non trouvé"));

        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);
        List<Class> apprenantClasses = classRepository.findByUsersContaining(apprenant);

        boolean hasCommonClass = formateurClasses.stream()
                .anyMatch(formateurClass -> apprenantClasses.contains(formateurClass));

        if (!hasCommonClass) {
            throw new UserException("Cet apprenant n'appartient pas à vos classes");
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

        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);
        List<Class> apprenantClasses = classRepository.findByUsersContaining(apprenant);

        boolean hasCommonClass = formateurClasses.stream()
                .anyMatch(formateurClass -> apprenantClasses.contains(formateurClass));

        if (!hasCommonClass) {
            throw new UserException("Cet apprenant n'appartient pas à vos classes");
        }

        apprenant.setActive(true);
        userRepository.save(apprenant);
    }

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public UserDTO createApprenantInFormateurClass(CreateApprenantRequest request) {
        User formateur = getCurrentFormateur();
        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);

        if (formateurClasses.isEmpty()) {
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
        apprenant.getClasses().add(formateurClasses.get(0));  // Ajouter à la première classe du formateur
        apprenant.setActive(true);

        User savedApprenant = userRepository.save(apprenant);
        
        Class classe = formateurClasses.get(0);
        classe.getUsers().add(savedApprenant);
        classRepository.save(classe);

        return userMapper.userToUserDTO(savedApprenant);
    }

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public UserDTO updateApprenantByFormateur(String apprenantId, UpdateApprenantRequest request) {
        User formateur = getCurrentFormateur();
        User apprenant = userRepository.findById(apprenantId)
                .orElseThrow(() -> new UserException("Apprenant non trouvé"));

        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);
        List<Class> apprenantClasses = classRepository.findByUsersContaining(apprenant);

        boolean hasCommonClass = formateurClasses.stream()
                .anyMatch(formateurClass -> apprenantClasses.contains(formateurClass));

        if (!hasCommonClass) {
            throw new UserException("Cet apprenant n'appartient pas à vos classes");
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

    @Override
    public User getCurrentFormateur() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User formateur = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException("Formateur non trouvé"));

        if (formateur.getRole() != Role.FORMATEUR) {
            throw new UserException("L'utilisateur n'est pas un formateur");
        }

        return formateur;
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<UserDTO> listFormateursArchives(Pageable pageable) {
        Page<UserDTO> formateurs = userRepository.findByRoleAndActiveFalse(Role.FORMATEUR, pageable)
                .map(userMapper::userToUserDTO);

        if (formateurs.isEmpty()) {
            throw new UserException("Il n'existe aucun formateur archivé");
        }

        return formateurs;
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<UserDTO> listApprenantsArchives(Pageable pageable) {
        Page<UserDTO> apprenants = userRepository.findByRoleAndActiveFalse(Role.APPRENANT, pageable)
                .map(userMapper::userToUserDTO);

        if (apprenants.isEmpty()) {
            throw new UserException("Il n'existe aucun apprenant archivé");
        }

        return apprenants;
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public void assignUserToClass(String userId, String classId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("Utilisateur non trouvé"));
        Class classe = classRepository.findById(classId)
                .orElseThrow(() -> new ClassException("Classe non trouvée"));

        if (!user.getClasses().contains(classe)) {
            user.getClasses().add(classe);
            userRepository.save(user);
        }

        if (!classe.getUsers().contains(user)) {
            classe.getUsers().add(user);
            classRepository.save(classe);
        }
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public void removeUserFromClass(String userId, String classId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("Utilisateur non trouvé"));
        Class classe = classRepository.findById(classId)
                .orElseThrow(() -> new ClassException("Classe non trouvée"));

        user.getClasses().remove(classe);
        userRepository.save(user);

        classe.getUsers().remove(user);
        classRepository.save(classe);
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<ClassDTO> getUserClasses(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("Utilisateur non trouvé"));
        return user.getClasses().stream()
                .map(classMapper::classToClassDTO)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserDTO> getClassUsers(String classId) {
        Class classe = classRepository.findById(classId)
                .orElseThrow(() -> new ClassException("Classe non trouvée"));
        return classe.getUsers().stream()
                .map(userMapper::userToUserDTO)
                .collect(Collectors.toList());
    }
}