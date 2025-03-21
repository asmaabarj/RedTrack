package com.redtrack.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import com.redtrack.dtos.classe.ClassDTO;
import com.redtrack.dtos.user.UserDTO;
import com.redtrack.model.entities.Class;
import com.redtrack.model.enums.Role;
import com.redtrack.model.entities.User;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public abstract class ClassMapper {

    @Autowired
    protected UserMapper userMapper;

    @Mapping(target = "formateurs", expression = "java(mapFormateurs(classe))")
    @Mapping(target = "apprenants", expression = "java(mapApprenants(classe))")
    public abstract ClassDTO classToClassDTO(Class classe);

    protected List<UserDTO> mapFormateurs(Class classe) {
        return classe.getUsers().stream()
                .filter(u -> u != null && u.getRole() == Role.FORMATEUR)
                .map(userMapper::userToUserDTO)
                .collect(Collectors.toList());
    }

    protected List<UserDTO> mapApprenants(Class classe) {
        return classe.getUsers().stream()
                .filter(u -> u != null && u.getRole() == Role.APPRENANT)
                .map(userMapper::userToUserDTO)
                .collect(Collectors.toList());
    }
}
