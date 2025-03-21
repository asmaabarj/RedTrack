package com.redtrack.model.entities;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "messages")
@Data
public class Message {
    @Id
    private String id;
    private String contenu;
    private LocalDateTime timestamp;
    private String roomId; // formateurId_apprenantId_classeId
    
    @DBRef
    private User expediteur;
    
    @DBRef
    private User destinataire;
    
    @DBRef
    private Class classe;
} 