package com.redtrack.mappers;

import com.redtrack.dtos.UserDTO;
import com.redtrack.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "roles", expression = "java(user.getRoles().stream().map(role -> role.getName()).collect(java.util.stream.Collectors.toList()))")
    UserDTO userToUserDTO(User user);
} 