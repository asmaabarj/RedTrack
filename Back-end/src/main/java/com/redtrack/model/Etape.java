package com.redtrack.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "etapes")
public class Etape {
    @Id
    private String id;
    private String titre;
    private Date deadline;
    private String description;
    private Statut statut = Statut.EnCours;
    
    @DBRef
    private Class classe;  
}
