package com.redtrack.model.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "etapes")
public class Etape {
    @Id
    private String id;
    private String titre;
    private Date deadline;
    private String description;
    private Date createdAt = new Date();
    
    @DBRef
    private List<Class> classes = new ArrayList<>();
}
