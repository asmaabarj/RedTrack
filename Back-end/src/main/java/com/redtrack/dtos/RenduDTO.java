package com.redtrack.dtos;

import java.util.Date;

import com.redtrack.model.Type;

import lombok.Data;

@Data
public class RenduDTO {
    private String id;
    private String livrable;
    private Date dateSoumission;
    private String commentaire;
    private Type type;

    private String etapeId;
    
    private String apprenantId;
    private String apprenantNom;
    private String apprenantPrenom;
} 