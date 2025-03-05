package com.redtrack.dtos;

import java.util.Date;
import java.util.List;

import com.redtrack.model.Statut;

import lombok.Data;

@Data
public class EtapeDTO {
    private String id;
    private String titre;
    private Date deadline;
    private String description;
    private Statut statut;
    private List<String> classesIds;
} 