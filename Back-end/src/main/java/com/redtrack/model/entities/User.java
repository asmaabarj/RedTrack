package com.redtrack.model.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.redtrack.model.enums.Role;
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
    private List<Class> classes = new ArrayList<>();

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", role=" + role +
                ", active=" + active +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
               Objects.equals(email, user.email) &&
               Objects.equals(nom, user.nom) &&
               Objects.equals(prenom, user.prenom) &&
               Objects.equals(role, user.role) &&
               Objects.equals(active, user.active);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, nom, prenom, role, active);
    }
}
