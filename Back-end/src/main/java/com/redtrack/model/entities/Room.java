package com.redtrack.model.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "rooms")
@Data
public class Room {
    @Id
    private String id;
    
    @DBRef
    private User formateur;
    
    @DBRef
    private User apprenant;
    
    @DBRef
    private Class classe;
} 