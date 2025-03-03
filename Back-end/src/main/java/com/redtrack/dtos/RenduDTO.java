package com.redtrack.dtos;

import java.util.Date;

import lombok.Data;

@Data
public class RenduDTO {
    private String id;
    private String livrable;
    private Date dateSoumission;
    private String commentaire;
    private String etapeId;
} 