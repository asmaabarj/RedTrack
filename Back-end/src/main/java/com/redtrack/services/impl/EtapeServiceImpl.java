package com.redtrack.services.impl;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.EtapeDTO;
import com.redtrack.exceptions.EtapeException;
import com.redtrack.exceptions.UserException;
import com.redtrack.mappers.EtapeMapper;
import com.redtrack.model.Class;
import com.redtrack.model.Etape;
import com.redtrack.model.User;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.EtapeRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.EtapeService;
import com.redtrack.services.interfaces.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EtapeServiceImpl implements EtapeService {
    private final EtapeRepository etapeRepository;
    private final EtapeMapper etapeMapper;
    private final UserService userService;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    @Override
    public EtapeDTO createEtape(EtapeDTO etapeDTO) {
        if (etapeDTO.getDeadline() != null && etapeDTO.getDeadline().before(new Date())) {
            throw new EtapeException("La date limite doit être dans le futur");
        }

        User formateur = getCurrentFormateur();
        List<Class> classes = classRepository.findByUsersContaining(formateur);
        if (classes.isEmpty()) {
            throw new EtapeException("Aucune classe assignée à ce formateur");
        }
        
        List<Class> activeClasses = classes.stream()
                .filter(Class::getActive)
                .collect(Collectors.toList());
                
        if (activeClasses.isEmpty()) {
            throw new EtapeException("Aucune classe active assignée à ce formateur");
        }
        
        Etape etape = etapeMapper.mapWithClasses(etapeDTO);
        
        if (etapeDTO.getClassesIds() == null || etapeDTO.getClassesIds().isEmpty()) {
            etape.getClasses().add(activeClasses.get(0));
        } else {
            for (String classId : etapeDTO.getClassesIds()) {
                Class classe = classRepository.findById(classId)
                    .orElseThrow(() -> new EtapeException("Classe non trouvée avec l'ID: " + classId));
                    
                if (!activeClasses.contains(classe)) {
                    throw new EtapeException("La classe " + classe.getNom() + " n'est pas une classe active du formateur");
                }
            }
        }
        
        Etape savedEtape = etapeRepository.save(etape);
        
        for (Class classe : etape.getClasses()) {
            classe.getEtapes().add(savedEtape);
            classRepository.save(classe);
        }
        
        return etapeMapper.etapeToEtapeDTO(savedEtape);
    }

    @Override
    public EtapeDTO updateEtape(String id, EtapeDTO etapeDTO) {
        if (etapeDTO.getDeadline() != null && etapeDTO.getDeadline().before(new Date())) {
            throw new EtapeException("La date limite doit être dans le futur");
        }

        User formateur = getCurrentFormateur();
        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);
        
        if (formateurClasses.isEmpty()) {
            throw new EtapeException("Aucune classe assignée à ce formateur");
        }

        List<Class> activeClasses = formateurClasses.stream()
                .filter(Class::getActive)
                .collect(Collectors.toList());
                
        if (activeClasses.isEmpty()) {
            throw new EtapeException("Aucune classe active assignée à ce formateur");
        }

        Class activeClass = activeClasses.get(0);

        Etape existingEtape = etapeRepository.findById(id)
                .orElseThrow(() -> new EtapeException("Étape non trouvée"));

        if (!existingEtape.getClasses().contains(activeClass)) {
            throw new EtapeException("Vous n'êtes pas autorisé à modifier cette étape");
        }

        existingEtape.setTitre(etapeDTO.getTitre());
        existingEtape.setDescription(etapeDTO.getDescription());
        existingEtape.setDeadline(etapeDTO.getDeadline());

        if (etapeDTO.getClassesIds() != null && !etapeDTO.getClassesIds().isEmpty()) {
            if (!etapeDTO.getClassesIds().contains(activeClass.getId())) {
                throw new EtapeException("L'étape doit rester associée à votre classe active");
            }
        }

        return etapeMapper.etapeToEtapeDTO(etapeRepository.save(existingEtape));
    }

    @Override
    public List<EtapeDTO> getAllEtapes() {
        User formateur = getCurrentFormateur();
        List<Class> classes = classRepository.findByUsersContaining(formateur);
        
        if (classes.isEmpty()) {
            throw new EtapeException("Aucune classe assignée à ce formateur");
        }
        
        List<Class> activeClasses = classes.stream()
                .filter(Class::getActive)
                .collect(Collectors.toList());
                
        if (activeClasses.isEmpty()) {
            throw new EtapeException("Aucune classe active assignée à ce formateur");
        }
        
        Class activeClass = activeClasses.get(0);
        
        return etapeRepository.findByClassesContainingOrderByCreatedAtDesc(activeClass)
                .stream()
                .map(etapeMapper::etapeToEtapeDTO)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasAuthority('APPRENANT')")
    public List<EtapeDTO> getEtapesForCurrentApprenant() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User apprenant = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException("Apprenant non trouvé"));

        List<Class> classes = classRepository.findByUsersContaining(apprenant);
        if (classes.isEmpty()) {
            throw new EtapeException("Aucune classe assignée à cet apprenant");
        }

        List<Class> activeClasses = classes.stream()
                .filter(Class::getActive)
                .collect(Collectors.toList());
                
        if (activeClasses.isEmpty()) {
            throw new EtapeException("Aucune classe active assignée à cet apprenant");
        }

        Class activeClass = activeClasses.get(0);
        
        return etapeRepository.findByClassesContainingOrderByCreatedAtDesc(activeClass)
                .stream()
                .map(etapeMapper::etapeToEtapeDTO)
                .collect(Collectors.toList());
    }

    private User getCurrentFormateur() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getCurrentFormateur();
    }
}
