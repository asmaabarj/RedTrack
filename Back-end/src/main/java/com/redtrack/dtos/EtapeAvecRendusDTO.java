package com.redtrack.dtos;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class EtapeAvecRendusDTO {
    private String id;
    private String titre;
    private String description;
    private Date deadline;
    private Date createdAt;
    private List<RenduAvecResponsesDTO> rendus;
} 