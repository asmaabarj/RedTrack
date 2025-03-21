package com.redtrack.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import com.redtrack.dtos.message.RoomDTO;
import com.redtrack.model.entities.Room;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ClassMapper.class})
public abstract class RoomMapper {

    @Autowired
    protected UserMapper userMapper;

    @Mapping(target = "formateur", expression = "java(userMapper.userToUserDTO(room.getFormateur()))")
    @Mapping(target = "apprenant", expression = "java(userMapper.userToUserDTO(room.getApprenant()))")
    @Mapping(target = "classe", source = "classe")
    public abstract RoomDTO roomToRoomDTO(Room room);
} 