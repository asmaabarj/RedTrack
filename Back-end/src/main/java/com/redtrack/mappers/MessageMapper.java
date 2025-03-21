package com.redtrack.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.redtrack.dtos.message.MessageDTO;
import com.redtrack.model.entities.Message;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface MessageMapper {
    @Mapping(target = "expediteurId", source = "expediteur.id")
    @Mapping(target = "destinataireId", source = "destinataire.id")
    @Mapping(target = "classeId", source = "classe.id")
    MessageDTO messageToMessageDTO(Message message);
} 