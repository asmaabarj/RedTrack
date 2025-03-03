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
        Class classe = formateur.getClasse();
        
        Etape etape = etapeMapper.etapeDTOToEtape(etapeDTO);
        etape.setClasse(classe);
        Etape savedEtape = etapeRepository.save(etape);
        
        // Mettre à jour la liste des étapes de la classe
        classe.getEtapes().add(savedEtape);
        classRepository.save(classe);
        
        return etapeMapper.etapeToEtapeDTO(savedEtape);
    }

    @Override
    public EtapeDTO updateEtape(String id, EtapeDTO etapeDTO) {
        User formateur = getCurrentFormateur();
        Etape existingEtape = etapeRepository.findById(id)
                .orElseThrow(() -> new EtapeException("Étape non trouvée"));

        if (!existingEtape.getClasse().getId().equals(formateur.getClasse().getId())) {
            throw new EtapeException("Vous n'êtes pas autorisé à modifier cette étape");
        }

        existingEtape.setTitre(etapeDTO.getTitre());
        existingEtape.setDescription(etapeDTO.getDescription());
        existingEtape.setDeadline(etapeDTO.getDeadline());
        existingEtape.setStatut(etapeDTO.getStatut());

        return etapeMapper.etapeToEtapeDTO(etapeRepository.save(existingEtape));
    }

    @Override
    public List<EtapeDTO> getAllEtapes() {
        User formateur = getCurrentFormateur();
        return etapeRepository.findByClasseIdOrderByDeadlineAsc(formateur.getClasse().getId())
                .stream()
                .map(etapeMapper::etapeToEtapeDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteEtape(String id) {
        User formateur = getCurrentFormateur();
        Etape etape = etapeRepository.findById(id)
                .orElseThrow(() -> new EtapeException("Étape non trouvée"));

        if (!etape.getClasse().getId().equals(formateur.getClasse().getId())) {
            throw new EtapeException("Vous n'êtes pas autorisé à supprimer cette étape");
        }

        Class classe = etape.getClasse();
        classe.getEtapes().remove(etape);
        classRepository.save(classe);
        
        etapeRepository.deleteById(id);
    }

    @Override
    @PreAuthorize("hasAuthority('APPRENANT')")
    public List<EtapeDTO> getEtapesForCurrentApprenant() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User apprenant = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException("Apprenant non trouvé"));

        if (apprenant.getClasse() == null) {
            throw new EtapeException("Aucune classe assignée à cet apprenant");
        }

        return etapeRepository.findByClasseIdOrderByDeadlineAsc(apprenant.getClasse().getId())
                .stream()
                .map(etapeMapper::etapeToEtapeDTO)
                .collect(Collectors.toList());
    }

    private User getCurrentFormateur() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getCurrentFormateur();
    }
}
