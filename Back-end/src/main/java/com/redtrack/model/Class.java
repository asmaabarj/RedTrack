package com.redtrack.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Class aClass = (Class) o;
        return Objects.equals(id, aClass.id) &&
               Objects.equals(nom, aClass.nom) &&
               Objects.equals(niveau, aClass.niveau) &&
               Objects.equals(annee, aClass.annee) &&
               Objects.equals(active, aClass.active);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nom, niveau, annee, active);
    }
}
