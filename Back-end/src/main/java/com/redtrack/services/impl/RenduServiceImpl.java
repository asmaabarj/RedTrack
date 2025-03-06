package com.redtrack.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.RenduDTO;
import com.redtrack.dtos.EtapeAvecRendusDTO;
import com.redtrack.dtos.RenduAvecResponsesDTO;
import com.redtrack.dtos.RenduResponseDTO;
import com.redtrack.exceptions.RenduException;
import com.redtrack.mappers.RenduMapper;
import com.redtrack.mappers.EtapeMapper;
import com.redtrack.mappers.RenduResponseMapper;
import com.redtrack.model.Class;
import com.redtrack.model.Etape;
import com.redtrack.model.Rendu;
import com.redtrack.model.User;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.EtapeRepository;
import com.redtrack.repositories.RenduRepository;
import com.redtrack.repositories.RenduResponseRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.RenduService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RenduServiceImpl implements RenduService {
    private final RenduRepository renduRepository;
    private final RenduResponseRepository renduResponseRepository;
    private final RenduMapper renduMapper;
    private final RenduResponseMapper renduResponseMapper;
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
    public List<EtapeAvecRendusDTO> getMesEtapesAvecRendus() {
        User apprenant = getCurrentApprenant();
        
        List<Class> classes = classRepository.findByUsersContaining(apprenant);
        List<Class> activeClasses = classes.stream()
                .filter(Class::getActive)
                .collect(Collectors.toList());
                
        if (activeClasses.isEmpty()) {
            throw new RenduException("Aucune classe active trouvée");
        }
        
        Class activeClass = activeClasses.get(0);
        
        List<Etape> etapes = etapeRepository.findByClassesContainingOrderByCreatedAtDesc(activeClass);
        
        return etapes.stream().map(etape -> {
            EtapeAvecRendusDTO dto = new EtapeAvecRendusDTO();
            dto.setId(etape.getId());
            dto.setTitre(etape.getTitre());
            dto.setDescription(etape.getDescription());
            dto.setDeadline(etape.getDeadline());
            dto.setCreatedAt(etape.getCreatedAt());
    
            List<RenduAvecResponsesDTO> rendus = renduRepository.findByEtapeIdAndApprenantId(etape.getId(), apprenant.getId())
                .stream()
                .map(rendu -> {
                    RenduAvecResponsesDTO renduDTO = new RenduAvecResponsesDTO();
                    BeanUtils.copyProperties(renduMapper.renduToRenduDTO(rendu), renduDTO);
                    List<RenduResponseDTO> responses = renduResponseRepository
                        .findByRenduIdOrderByDateSoumissionDesc(rendu.getId())
                        .stream()
                        .map(renduResponseMapper::renduResponseToRenduResponseDTO)
                        .collect(Collectors.toList());
                    renduDTO.setResponses(responses);
                    return renduDTO;
                })
                .collect(Collectors.toList());
    
            dto.setRendus(rendus);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public List<EtapeAvecRendusDTO> getEtapesAvecRendusByApprenant(String apprenantId) {
        String formateurEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User formateur = userRepository.findByEmail(formateurEmail)
                .orElseThrow(() -> new RenduException("Formateur non trouvé"));

        User apprenant = userRepository.findById(apprenantId)
                .orElseThrow(() -> new RenduException("Apprenant non trouvé"));

        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);
        List<Class> apprenantClasses = classRepository.findByUsersContaining(apprenant);
        
        boolean hasCommonClass = formateurClasses.stream()
                .anyMatch(apprenantClasses::contains);
        
        if (!hasCommonClass) {
            throw new RenduException("Cet apprenant n'appartient pas à vos classes");
        }

        List<Class> activeClasses = apprenantClasses.stream()
                .filter(Class::getActive)
                .collect(Collectors.toList());

        if (activeClasses.isEmpty()) {
            throw new RenduException("Aucune classe active trouvée pour cet apprenant");
        }

        Class activeClass = activeClasses.get(0);

        List<Etape> etapes = etapeRepository.findByClassesContainingOrderByCreatedAtDesc(activeClass);

        return etapes.stream().map(etape -> {
            EtapeAvecRendusDTO dto = new EtapeAvecRendusDTO();
            dto.setId(etape.getId());
            dto.setTitre(etape.getTitre());
            dto.setDescription(etape.getDescription());
            dto.setDeadline(etape.getDeadline());
            dto.setCreatedAt(etape.getCreatedAt());

            List<RenduAvecResponsesDTO> rendus = renduRepository.findByEtapeIdAndApprenantId(etape.getId(), apprenant.getId())
                    .stream()
                    .map(rendu -> {
                        RenduAvecResponsesDTO renduDTO = new RenduAvecResponsesDTO();
                        BeanUtils.copyProperties(renduMapper.renduToRenduDTO(rendu), renduDTO);
                        List<RenduResponseDTO> responses = renduResponseRepository
                            .findByRenduIdOrderByDateSoumissionDesc(rendu.getId())
                            .stream()
                            .map(renduResponseMapper::renduResponseToRenduResponseDTO)
                            .collect(Collectors.toList());
                        renduDTO.setResponses(responses);
                        return renduDTO;
                    })
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