package com.redtrack.services.impl;

import com.redtrack.dtos.rendu.RenduResponseDTO;
import com.redtrack.dtos.rendu.CreateRenduResponseRequest;
import com.redtrack.exceptions.RenduException;
import com.redtrack.mappers.RenduResponseMapper;
import com.redtrack.model.entities.Rendu;
import com.redtrack.model.entities.RenduResponse;
import com.redtrack.model.entities.User;
import com.redtrack.model.entities.Class;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.RenduResponseRepository;
import com.redtrack.repositories.RenduRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.RenduResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RenduResponseServiceImpl implements RenduResponseService {
    private final RenduResponseRepository renduResponseRepository;
    private final RenduRepository renduRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final RenduResponseMapper renduResponseMapper;

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public RenduResponseDTO createRenduResponse(String renduId, CreateRenduResponseRequest request) {
        String formateurEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User formateur = userRepository.findByEmail(formateurEmail)
                .orElseThrow(() -> new RenduException("Formateur non trouvé"));

        Rendu rendu = renduRepository.findById(renduId)
                .orElseThrow(() -> new RenduException("Rendu non trouvé"));

        List<Class> formateurClasses = classRepository.findByUsersContaining(formateur);
        boolean hasAccess = rendu.getEtape().getClasses().stream()
                .anyMatch(formateurClasses::contains);

        if (!hasAccess) {
            throw new RenduException("Vous n'avez pas accès à ce rendu");
        }

        RenduResponse response = renduResponseMapper.createRenduResponseRequestToRenduResponse(request);
        response.setFormateur(formateur);
        response.setRendu(rendu);

        rendu.setType(request.getType());
        renduRepository.save(rendu);

        return renduResponseMapper.renduResponseToRenduResponseDTO(renduResponseRepository.save(response));
    }

    @Override
    @PreAuthorize("hasAuthority('FORMATEUR')")
    public List<RenduResponseDTO> getRenduResponses(String renduId) {
        return renduResponseRepository.findByRenduId(renduId)
                .stream()
                .map(renduResponseMapper::renduResponseToRenduResponseDTO)
                .collect(Collectors.toList());
    }

}
