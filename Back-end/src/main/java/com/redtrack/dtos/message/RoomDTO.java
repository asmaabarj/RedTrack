package com.redtrack.dtos.message;

import com.redtrack.dtos.classe.ClassDTO;
import com.redtrack.dtos.user.UserDTO;

import lombok.Data;

@Data
public class RoomDTO {
    private String id;
    private UserDTO formateur;
    private UserDTO apprenant;
    private ClassDTO classe;
} 