package com.redtrack.dtos;

import com.redtrack.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String email;
    private String nom;
    private String prenom;
    private Role role;
    private Boolean active;
} 