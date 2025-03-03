package com.redtrack.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String email;
    private String nom;
    private String prenom;
    private String password;
    private Role role;
    private Boolean active = true;
    
    @DBRef
    private Class classe;
}
