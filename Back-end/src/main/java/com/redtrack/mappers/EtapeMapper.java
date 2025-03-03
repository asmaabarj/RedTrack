package com.redtrack.mappers;

import org.mapstruct.Mapper;
import com.redtrack.dtos.EtapeDTO;
import com.redtrack.model.Etape;

@Mapper(componentModel = "spring")
public interface EtapeMapper {
    EtapeDTO etapeToEtapeDTO(Etape etape);
    Etape etapeDTOToEtape(EtapeDTO etapeDTO);
}
