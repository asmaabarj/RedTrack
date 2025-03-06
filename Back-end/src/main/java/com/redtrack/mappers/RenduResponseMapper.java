package com.redtrack.mappers;

import com.redtrack.dtos.rendu.CreateRenduResponseRequest;
import com.redtrack.dtos.rendu.RenduResponseDTO;
import com.redtrack.model.entities.RenduResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RenduResponseMapper {
    @Mapping(source = "formateur.id", target = "formateurId")
    @Mapping(source = "formateur.nom", target = "formateurNom")
    @Mapping(source = "formateur.prenom", target = "formateurPrenom")
    @Mapping(source = "rendu.id", target = "renduId")
    RenduResponseDTO renduResponseToRenduResponseDTO(RenduResponse renduResponse);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateSoumission", expression = "java(new java.util.Date())")
    @Mapping(target = "formateur", ignore = true)
    @Mapping(target = "rendu", ignore = true)
    RenduResponse createRenduResponseRequestToRenduResponse(CreateRenduResponseRequest request);
}
