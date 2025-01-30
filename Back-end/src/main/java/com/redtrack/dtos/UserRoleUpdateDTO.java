package com.redtrack.dtos;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class UserRoleUpdateDTO {
    @NotEmpty(message = "La liste des rôles ne peut pas être vide")
    private List<String> roleNames;
} 