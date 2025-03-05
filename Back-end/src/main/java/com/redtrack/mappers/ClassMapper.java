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

@Mapper(componentModel = "spring")
public interface ClassMapper {
    @Mapping(target = "formateurs", expression = "java(mapFormateursIds(classe))")
    @Mapping(target = "apprenants", expression = "java(mapApprenantsIds(classe))")
    ClassDTO classToClassDTO(Class classe);

    default List<String> mapFormateursIds(Class classe) {
        return classe.getUsers().stream()
                .filter(u -> u.getRole() == Role.FORMATEUR)
                .map(User::getId)
                .collect(Collectors.toList());
    }

    default List<String> mapApprenantsIds(Class classe) {
        return classe.getUsers().stream()
                .filter(u -> u.getRole() == Role.APPRENANT)
                .map(User::getId)
                .collect(Collectors.toList());
    }
}
