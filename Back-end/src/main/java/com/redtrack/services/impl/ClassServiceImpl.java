package com.redtrack.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.ClassDTO;
import com.redtrack.dtos.ClassDetailsDTO;
import com.redtrack.dtos.CreateClassRequest;
import com.redtrack.exceptions.ClassException;
import com.redtrack.exceptions.UserException;
import com.redtrack.mappers.ClassMapper;
import com.redtrack.mappers.UserMapper;
import com.redtrack.model.Class;
import com.redtrack.model.Role;
import com.redtrack.model.User;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.ClassService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {
    private static final Logger logger = LoggerFactory.getLogger(ClassServiceImpl.class);

    private final ClassRepository classRepository;
    private final UserRepository userRepository;
    private final ClassMapper classMapper;
    private final UserMapper userMapper;

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public ClassDTO createClass(CreateClassRequest request) {
        if (classRepository.existsByNom(request.getNom())) {
            throw new UserException("Une classe avec ce nom existe déjà");
        }

        Class classe = new Class();
        classe.setNom(request.getNom());
        classe.setNiveau(request.getNiveau());
        classe.setAnnee(request.getAnnee());
        classe.setUsers(new ArrayList<>());

        return classMapper.classToClassDTO(classRepository.save(classe));
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public ClassDTO getClass(String id) {
        Class classe = classRepository.findById(id)
                .orElseThrow(() -> new UserException("Classe non trouvée"));
        return classMapper.classToClassDTO(classe);
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<ClassDTO> getAllClasses(Pageable pageable) {
        return classRepository.findByActiveTrue(pageable)
                .map(classMapper::classToClassDTO);
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public ClassDTO updateClass(String id, CreateClassRequest request) {
        Class classe = classRepository.findById(id)
                .orElseThrow(() -> new ClassException("Classe non trouvée"));

        if (!classe.getNom().equals(request.getNom()) &&
                classRepository.existsByNom(request.getNom())) {
            throw new ClassException("Une classe avec ce nom existe déjà");
        }

        classe.setNom(request.getNom());
        classe.setNiveau(request.getNiveau());
        classe.setAnnee(request.getAnnee());

        return classMapper.classToClassDTO(classRepository.save(classe));
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public void archiveClass(String id) {
        Class classe = classRepository.findById(id)
                .orElseThrow(() -> new ClassException("Classe non trouvée avec l'ID: " + id));
        classe.setActive(false);
        classRepository.save(classe);
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public void unarchiveClass(String id) {
        Class classe = classRepository.findById(id)
                .orElseThrow(() -> new ClassException("Classe non trouvée avec l'ID: " + id));
        classe.setActive(true);
        classRepository.save(classe);
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<ClassDTO> getArchivedClasses(Pageable pageable) {
        return classRepository.findByActiveFalse(pageable)
                .map(classMapper::classToClassDTO);
    }

    @PreAuthorize("hasAuthority('FORMATEUR')")
    public ClassDTO updateFormateurClass(String id, CreateClassRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User formateur = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException("Formateur non trouvé"));

        Class classe = classRepository.findById(id)
                .orElseThrow(() -> new ClassException("Classe non trouvée"));

        if (!classe.getUsers().contains(formateur)) {
            throw new ClassException("Vous n'êtes pas autorisé à modifier cette classe");
        }

        classe.setNom(request.getNom());
        classe.setNiveau(request.getNiveau());
        classe.setAnnee(request.getAnnee());
        return classMapper.classToClassDTO(classRepository.save(classe));
    }

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public ClassDTO getFormateurOwnClass() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User formateur = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException("Formateur non trouvé"));

        List<Class> classes = classRepository.findByUsersContaining(formateur).stream()
                .filter(Class::getActive)
                .collect(Collectors.toList());

        if (classes.isEmpty()) {
            throw new ClassException("Aucune classe active n'est assignée à ce formateur");
        }

        return classMapper.classToClassDTO(classes.get(0));
    }

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public ClassDetailsDTO getClassDetails(String id) {
        Class classe = classRepository.findById(id)
                .orElseThrow(() -> new ClassException("Classe non trouvée"));

        ClassDetailsDTO details = new ClassDetailsDTO();
        details.setId(classe.getId());
        details.setNom(classe.getNom());
        details.setNiveau(classe.getNiveau());
        details.setAnnee(classe.getAnnee());
        details.setActive(classe.getActive());
        
        details.setFormateurs(classe.getUsers().stream()
                .filter(user -> user.getRole() == Role.FORMATEUR)
                .map(userMapper::userToUserDTO)
                .collect(Collectors.toList()));
                
        details.setApprenants(classe.getUsers().stream()
                .filter(user -> user.getRole() == Role.APPRENANT)
                .map(userMapper::userToUserDTO)
                .collect(Collectors.toList()));

        return details;
    }
}
