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
    private Date dateSoumission = new Date();
    private String commentaire;
    private Type type = Type.pending;
    
    @DBRef
    private Etape etape;
    
    @DBRef
    private User apprenant;
} 