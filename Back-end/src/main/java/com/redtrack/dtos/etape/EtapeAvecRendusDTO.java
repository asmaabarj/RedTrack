package com.redtrack.dtos.etape;

import java.util.Date;
import java.util.List;

import com.redtrack.dtos.rendu.RenduAvecResponsesDTO;
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