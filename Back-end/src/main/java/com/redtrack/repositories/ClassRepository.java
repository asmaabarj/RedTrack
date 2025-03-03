package com.redtrack.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.redtrack.model.Class;

public interface ClassRepository extends MongoRepository<Class, String> {
    boolean existsByNom(String nom);
    Page<Class> findByActiveTrue(Pageable pageable);
}
