package com.redtrack.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.redtrack.dtos.RenduDTO;
import com.redtrack.model.Rendu;

@Mapper(componentModel = "spring")
public interface RenduMapper {
    @Mapping(source = "etape.id", target = "etapeId")
    RenduDTO renduToRenduDTO(Rendu rendu);
    
    @Mapping(target = "etape", ignore = true)
    @Mapping(target = "apprenant", ignore = true)
    Rendu renduDTOToRendu(RenduDTO renduDTO);
} 