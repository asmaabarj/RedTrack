package com.redtrack.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import com.redtrack.dtos.etape.EtapeDTO;
import com.redtrack.model.entities.Etape;
import com.redtrack.repositories.ClassRepository;

@Mapper(componentModel = "spring")
public abstract class EtapeMapper {
    
    @Autowired
    protected ClassRepository classRepository;

    @Mapping(target = "classesIds", expression = "java(mapClassIds(etape))")
    public abstract EtapeDTO etapeToEtapeDTO(Etape etape);

    @Mapping(target = "classes", ignore = true)
    public abstract Etape etapeDTOToEtape(EtapeDTO etapeDTO);

    protected List<String> mapClassIds(Etape etape) {
        if (etape == null || etape.getClasses() == null) {
            return null;
        }
        return etape.getClasses().stream()
            .map(c -> c.getId())
            .collect(Collectors.toList());
    }

    public Etape mapWithClasses(EtapeDTO etapeDTO) {
        Etape etape = etapeDTOToEtape(etapeDTO);
        if (etapeDTO.getClassesIds() != null) {
            etape.setClasses(etapeDTO.getClassesIds().stream()
                .map(id -> classRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Classe non trouvée avec l'ID: " + id)))
                .collect(Collectors.toList()));
        }
        return etape;
    }
}
