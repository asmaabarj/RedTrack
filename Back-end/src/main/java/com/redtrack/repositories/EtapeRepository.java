package com.redtrack.repositories;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.redtrack.model.Class;
import com.redtrack.model.Etape;

@Repository
public interface EtapeRepository extends MongoRepository<Etape, String> {
    List<Etape> findByClassesContainingOrderByCreatedAtDesc(Class classe);
}
