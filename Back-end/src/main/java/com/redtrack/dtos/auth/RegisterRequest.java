package com.redtrack.dtos.auth;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.redtrack.model.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
    
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
    
    @NotNull(message = "Le rôle est obligatoire")
    private Role role;
    
    @NotBlank(message = "La classe est obligatoire")
    private String classeId;
}