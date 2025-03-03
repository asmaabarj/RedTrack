package com.redtrack.mappers;

import org.mapstruct.Mapper;

import com.redtrack.dtos.ClassDTO;
import com.redtrack.model.Class;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ClassMapper {
    ClassDTO classToClassDTO(Class classe);
}
