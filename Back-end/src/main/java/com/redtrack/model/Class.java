package com.redtrack.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "classes")
@Data
public class Class {
    @Id
    private String id;
    private String nom;
    private String niveau;
    private Boolean active = true;
    
    @DBRef
    private List<User> apprenants;
    
    @DBRef
    private List<User> formateurs;
}
