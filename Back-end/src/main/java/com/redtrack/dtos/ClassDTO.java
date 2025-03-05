package com.redtrack.dtos;

import java.util.List;

import lombok.Data;

@Data
public class ClassDTO {
    private String id;
    private String nom;
    private String niveau;
    private String annee;
    private Boolean active;
    private List<String> formateurs;
    private List<String> apprenants;
    private List<String> etapesIds;
}