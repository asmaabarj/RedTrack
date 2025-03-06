package com.redtrack.dtos.rendu;
import lombok.Data;
import java.util.Date;

@Data
public class RenduResponseDTO {
    private String id;
    private String commentaire;
    private Date dateSoumission;
    private String formateurId;
    private String formateurNom;
    private String formateurPrenom;
    private String renduId;
} 