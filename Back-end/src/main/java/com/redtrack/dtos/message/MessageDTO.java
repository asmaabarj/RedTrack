package com.redtrack.dtos.message;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MessageDTO {
    private String id;
    private String contenu;
    private String expediteurId;
    private String destinataireId;
    private String roomId;
    private String classeId;
    private LocalDateTime timestamp;
} 