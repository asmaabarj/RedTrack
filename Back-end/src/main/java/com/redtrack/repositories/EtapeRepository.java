package com.redtrack.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.redtrack.model.Etape;

public interface EtapeRepository extends MongoRepository<Etape, String> {
}
