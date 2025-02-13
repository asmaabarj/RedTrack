package com.redtrack.mappers;

import com.redtrack.dtos.UserDTO;
import com.redtrack.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    UserDTO userToUserDTO(User user);
} 