package com.redtrack.dtos.classe;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CreateClassRequest {
    @NotBlank(message = "Le nom de la classe est obligatoire")
    private String nom;
    
    @NotBlank(message = "Le niveau est obligatoire")
    private String niveau;
    
    @NotBlank(message = "L'année est obligatoire")
    private String annee;
} 