package com.redtrack.dtos;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class EtapeDTO {
    private String id;
    
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;
    
    @NotNull(message = "La date limite est obligatoire")
    @Future(message = "La date limite doit être dans le futur")
    private Date deadline;
    
    @NotBlank(message = "La description est obligatoire")
    private String description;
    
    private List<String> classesIds;
} 