package com.redtrack.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.redtrack.dtos.UserDTO;
import com.redtrack.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "classeId", expression = "java(user.getClasse() != null ? user.getClasse().getId() : null)")
    UserDTO userToUserDTO(User user);
} 