package com.redtrack.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.redtrack.dtos.ClassDTO;
import com.redtrack.dtos.UserDTO;
import com.redtrack.model.Class;
import com.redtrack.model.Role;
import com.redtrack.model.User;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ClassMapper {
    @Mapping(target = "formateurs", expression = "java(mapFormateurs(classe))")
    @Mapping(target = "apprenants", expression = "java(mapApprenants(classe))")
    ClassDTO classToClassDTO(Class classe);

    default List<UserDTO> mapFormateurs(Class classe) {
        return classe.getUsers().stream()
                .filter(u -> u.getRole() == Role.FORMATEUR)
                .map(this::mapUser)
                .collect(Collectors.toList());
    }

    default List<UserDTO> mapApprenants(Class classe) {
        return classe.getUsers().stream()
                .filter(u -> u.getRole() == Role.APPRENANT)
                .map(this::mapUser)
                .collect(Collectors.toList());
    }

    UserDTO mapUser(User user);
}
