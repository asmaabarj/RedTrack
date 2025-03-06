package com.redtrack.dtos.rendu;
import com.redtrack.model.enums.Type;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class RenduAvecResponsesDTO {
    private String id;
    private String livrable;
    private Date dateSoumission;
    private String commentaire;
    private Type type;
    private String etapeId;
    private String apprenantId;
    private String apprenantNom;
    private String apprenantPrenom;
    private List<RenduResponseDTO> responses;
} 