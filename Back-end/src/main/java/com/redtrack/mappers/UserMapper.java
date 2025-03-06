package com.redtrack.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.redtrack.dtos.user.UserDTO;
import com.redtrack.model.entities.Class;
import com.redtrack.model.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "classesIds", expression = "java(mapClassIds(user))")
    UserDTO userToUserDTO(User user);

    default List<String> mapClassIds(User user) {
        return user.getClasses().stream()
                .map(Class::getId)
                .collect(Collectors.toList());
    }
} 