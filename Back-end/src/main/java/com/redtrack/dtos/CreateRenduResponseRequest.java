package com.redtrack.dtos;

import com.redtrack.model.Type;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CreateRenduResponseRequest {
    @NotBlank(message = "Le commentaire est obligatoire")
    private String commentaire;
    
    @NotNull(message = "Le type est obligatoire")
    private Type type;
} 