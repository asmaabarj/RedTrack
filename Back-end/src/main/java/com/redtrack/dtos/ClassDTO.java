package com.redtrack.dtos;

import lombok.Data;

@Data
public class ClassDTO {
    private String id;
    private String nom;
    private String niveau;
    private Boolean active;
}