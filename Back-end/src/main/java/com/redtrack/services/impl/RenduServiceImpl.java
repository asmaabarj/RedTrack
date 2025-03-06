package com.redtrack.services.impl;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.RenduDTO;
import com.redtrack.dtos.EtapeAvecRendusDTO;
import com.redtrack.exceptions.RenduException;
import com.redtrack.mappers.RenduMapper;
import com.redtrack.mappers.EtapeMapper;
import com.redtrack.model.Class;
import com.redtrack.model.Etape;
import com.redtrack.model.Rendu;
import com.redtrack.model.User;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.EtapeRepository;
import com.redtrack.repositories.RenduRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.RenduService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RenduServiceImpl implements RenduService {
    private final RenduRepository renduRepository;
    private final RenduMapper renduMapper;
    private final UserRepository userRepository;
    private final EtapeRepository etapeRepository;
    private final ClassRepository classRepository;
    private final EtapeMapper etapeMapper;

    @Override
    @PreAuthorize("hasAuthority('APPRENANT')")
    public RenduDTO createRendu(RenduDTO renduDTO) {
        User apprenant = getCurrentApprenant();
        Etape etape = etapeRepository.findById(renduDTO.getEtapeId())
                .orElseThrow(() -> new RenduException("Étape non trouvée"));

        List<Class> apprenantClasses = classRepository.findByUsersContaining(apprenant);
        boolean hasCommonClass = etape.getClasses().stream()
                .anyMatch(apprenantClasses::contains);
        if (!hasCommonClass) {
            throw new RenduException("Cette étape n'appartient pas à vos classes");
        }

        Rendu rendu = renduMapper.renduDTOToRendu(renduDTO);
        rendu.setEtape(etape);
        rendu.setApprenant(apprenant);

        return renduMapper.renduToRenduDTO(renduRepository.save(rendu));
    }

    @Override
    @PreAuthorize("hasAuthority('APPRENANT')")
    public List<RenduDTO> getMesRendus() {
        User apprenant = getCurrentApprenant();
        return renduRepository.findByApprenantId(apprenant.getId())
                .stream()
                .map(renduMapper::renduToRenduDTO)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasAuthority('APPRENANT')")
    public List<EtapeAvecRendusDTO> getMesEtapesAvecRendus() {
        User apprenant = getCurrentApprenant();
        
        // Récupérer la classe active de l'apprenant
        List<Class> classes = classRepository.findByUsersContaining(apprenant);
        List<Class> activeClasses = classes.stream()
                .filter(Class::getActive)
                .collect(Collectors.toList());
                
        if (activeClasses.isEmpty()) {
            throw new RenduException("Aucune classe active trouvée");
        }
        
        Class activeClass = activeClasses.get(0);
        
        // Récupérer toutes les étapes de la classe active, triées par date de création décroissante
        List<Etape> etapes = etapeRepository.findByClassesContainingOrderByCreatedAtDesc(activeClass);
        
        // Pour chaque étape, récupérer les rendus de l'apprenant
        return etapes.stream().map(etape -> {
            EtapeAvecRendusDTO dto = new EtapeAvecRendusDTO();
            dto.setId(etape.getId());
            dto.setTitre(etape.getTitre());
            dto.setDescription(etape.getDescription());
            dto.setDeadline(etape.getDeadline());
            dto.setCreatedAt(etape.getCreatedAt()); // Ajout de la date de création
            
            // Récupérer les rendus de l'apprenant pour cette étape
            List<RenduDTO> rendus = renduRepository.findByEtapeIdAndApprenantId(etape.getId(), apprenant.getId())
                    .stream()
                    .map(renduMapper::renduToRenduDTO)
                    .collect(Collectors.toList());
            
            dto.setRendus(rendus);
            return dto;
        }).collect(Collectors.toList());
    }

    private User getCurrentApprenant() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User apprenant = userRepository.findByEmail(email)
                .orElseThrow(() -> new RenduException("Apprenant non trouvé"));

        List<Class> classes = classRepository.findByUsersContaining(apprenant);
        if (classes.isEmpty()) {
            throw new RenduException("Vous n'êtes pas assigné à une classe");
        }

        return apprenant;
    }
} 