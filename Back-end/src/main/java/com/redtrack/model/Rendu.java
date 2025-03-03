package com.redtrack.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "rendus")
public class Rendu {
    @Id
    private String id;
    private String livrable;
    private Date dateSoumission;
    private String commentaire;
    
    @DBRef
    private Etape etape;
    
    @DBRef
    private User apprenant;
} 