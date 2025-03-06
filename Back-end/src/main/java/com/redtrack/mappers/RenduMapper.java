package com.redtrack.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.redtrack.dtos.RenduDTO;
import com.redtrack.model.Rendu;

@Mapper(componentModel = "spring")
public interface RenduMapper {
    @Mapping(source = "etape.id", target = "etapeId")
    @Mapping(source = "apprenant.id", target = "apprenantId")
    @Mapping(source = "apprenant.nom", target = "apprenantNom")
    @Mapping(source = "apprenant.prenom", target = "apprenantPrenom")
    RenduDTO renduToRenduDTO(Rendu rendu);
    
    @Mapping(target = "etape", ignore = true)
    @Mapping(target = "apprenant", ignore = true)
    @Mapping(target = "type", constant = "pending")
    @Mapping(target = "dateSoumission", expression = "java(new java.util.Date())")
    Rendu renduDTOToRendu(RenduDTO renduDTO);
} 