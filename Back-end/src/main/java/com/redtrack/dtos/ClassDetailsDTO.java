package com.redtrack.dtos;

import java.util.List;
import lombok.Data;

@Data
public class ClassDetailsDTO {
    private String id;
    private String nom;
    private String niveau;
    private String annee;
    private Boolean active;
    private List<UserDTO> formateurs;
    private List<UserDTO> apprenants;
} 