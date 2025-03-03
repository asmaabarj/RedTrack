package com.redtrack.services.impl;

import com.redtrack.exceptions.ClassException;
import com.redtrack.mappers.ClassMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.access.prepost.PreAuthorize;

import com.redtrack.dtos.ClassDTO;
import com.redtrack.dtos.CreateClassRequest;
import com.redtrack.exceptions.UserException;
import com.redtrack.model.Class;

import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.ClassService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {
    private final ClassRepository classRepository;
    private final UserRepository userRepository;
    private final ClassMapper classMapper;

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    public ClassDTO createClass(CreateClassRequest request) {
        if (classRepository.existsByNom(request.getNom())) {
            throw new UserException("Une classe avec ce nom existe déjà");
        }

        Class classe = new Class();
        classe.setNom(request.getNom());
        classe.setNiveau(request.getNiveau());
        
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
}
