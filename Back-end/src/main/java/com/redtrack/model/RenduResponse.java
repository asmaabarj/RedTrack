package com.redtrack.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "rendusResponses")
public class RenduResponse {
    @Id
    private String id;
    private String commentaire;
    private Date dateSoumission = new Date();
    
    @DBRef
    private User formateur;
    
    @DBRef
    private Rendu rendu;
}
