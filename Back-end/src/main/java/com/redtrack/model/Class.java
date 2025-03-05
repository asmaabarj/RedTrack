package com.redtrack.model;

import java.util.ArrayList;
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
    private String annee;
    private Boolean active = true;



    @DBRef
    private List<Etape> etapes = new ArrayList<>();

    @DBRef
    
    private List<User> users = new ArrayList<>();

    @Override
    public String toString() {
        return "Class{" +
                "id='" + id + '\'' +
                ", nom='" + nom + '\'' +
                '}';
    }
}
