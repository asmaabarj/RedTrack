package com.redtrack.services.impl;

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
        User formateur = getCurrentFormateur();
        List<Class> classes = classRepository.findByUsersContaining(formateur);
        if (classes.isEmpty()) {
            throw new EtapeException("Aucune classe assignée à ce formateur");
        }
        
        Etape etape = etapeMapper.mapWithClasses(etapeDTO);
        if (etapeDTO.getClassesIds() == null || etapeDTO.getClassesIds().isEmpty()) {
            etape.getClasses().add(classes.get(0)); // Ajouter la première classe par défaut
        }
        
        Etape savedEtape = etapeRepository.save(etape);
        
        // Mettre à jour les classes avec la nouvelle étape
        for (Class classe : etape.getClasses()) {
            classe.getEtapes().add(savedEtape);
            classRepository.save(classe);
        }
        
        return etapeMapper.etapeToEtapeDTO(savedEtape);
    }

    @Override
    public EtapeDTO updateEtape(String id, EtapeDTO etapeDTO) {
        User formateur = getCurrentFormateur();
        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);
        Etape existingEtape = etapeRepository.findById(id)
                .orElseThrow(() -> new EtapeException("Étape non trouvée"));

        boolean hasCommonClass = existingEtape.getClasses().stream()
                .anyMatch(formateurClasses::contains);
        if (!hasCommonClass) {
            throw new EtapeException("Vous n'êtes pas autorisé à modifier cette étape");
        }

        existingEtape.setTitre(etapeDTO.getTitre());
        existingEtape.setDescription(etapeDTO.getDescription());
        existingEtape.setDeadline(etapeDTO.getDeadline());
        existingEtape.setStatut(etapeDTO.getStatut());

        // Mettre à jour les classes si nécessaire
        if (etapeDTO.getClassesIds() != null) {
            List<Class> newClasses = etapeDTO.getClassesIds().stream()
                .map(classId -> classRepository.findById(classId)
                    .orElseThrow(() -> new EtapeException("Classe non trouvée avec l'ID: " + classId)))
                .collect(Collectors.toList());
            
            // Vérifier que le formateur a accès à toutes les nouvelles classes
            if (!newClasses.stream().allMatch(formateurClasses::contains)) {
                throw new EtapeException("Vous n'avez pas accès à toutes les classes spécifiées");
            }
            
            // Retirer l'étape des anciennes classes
            for (Class oldClass : existingEtape.getClasses()) {
                if (!newClasses.contains(oldClass)) {
                    oldClass.getEtapes().remove(existingEtape);
                    classRepository.save(oldClass);
                }
            }
            
            // Ajouter l'étape aux nouvelles classes
            for (Class newClass : newClasses) {
                if (!existingEtape.getClasses().contains(newClass)) {
                    newClass.getEtapes().add(existingEtape);
                    classRepository.save(newClass);
                }
            }
            
            existingEtape.setClasses(newClasses);
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
        Class classe = classes.get(0);
        
        return etapeRepository.findAll().stream()
                .filter(etape -> etape.getClasses().contains(classe))
                .sorted((e1, e2) -> e1.getDeadline().compareTo(e2.getDeadline()))
                .map(etapeMapper::etapeToEtapeDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteEtape(String id) {
        User formateur = getCurrentFormateur();
        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);
        Etape etape = etapeRepository.findById(id)
                .orElseThrow(() -> new EtapeException("Étape non trouvée"));

        boolean hasCommonClass = etape.getClasses().stream()
                .anyMatch(formateurClasses::contains);
        if (!hasCommonClass) {
            throw new EtapeException("Vous n'êtes pas autorisé à supprimer cette étape");
        }

        // Retirer l'étape de toutes les classes
        for (Class classe : etape.getClasses()) {
            classe.getEtapes().remove(etape);
            classRepository.save(classe);
        }
        
        etapeRepository.deleteById(id);
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
        Class classe = classes.get(0);
        
        return etapeRepository.findAll().stream()
                .filter(etape -> etape.getClasses().contains(classe))
                .sorted((e1, e2) -> e1.getDeadline().compareTo(e2.getDeadline()))
                .map(etapeMapper::etapeToEtapeDTO)
                .collect(Collectors.toList());
    }

    private User getCurrentFormateur() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getCurrentFormateur();
    }
}
