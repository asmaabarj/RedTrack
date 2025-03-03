package com.redtrack.dtos;

import java.util.Set;

import lombok.Data;

@Data
public class ClassDTO {
    private String id;
    private String nom;
    private String niveau;
    private String annee;
    private Boolean active;
    private Set<UserDTO> users;
}