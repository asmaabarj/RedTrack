package com.redtrack.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.redtrack.model.Rendu;

@Repository
public interface RenduRepository extends MongoRepository<Rendu, String> {
    List<Rendu> findByApprenantId(String apprenantId);
    List<Rendu> findByEtapeIdAndApprenantId(String etapeId, String apprenantId);
    boolean existsByEtapeIdAndApprenantId(String etapeId, String apprenantId);
} 