package com.redtrack.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.redtrack.model.Rendu;

public interface RenduRepository extends MongoRepository<Rendu, String> {
    List<Rendu> findByApprenantId(String apprenantId);
    List<Rendu> findByEtapeId(String etapeId);
    boolean existsByEtapeIdAndApprenantId(String etapeId, String apprenantId);
} 