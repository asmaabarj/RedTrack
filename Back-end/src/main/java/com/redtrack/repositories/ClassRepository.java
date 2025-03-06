package com.redtrack.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.redtrack.model.entities.Class;
import com.redtrack.model.entities.User;

public interface ClassRepository extends MongoRepository<Class, String> {
    boolean existsByNom(String nom);
    Page<Class> findByActiveTrue(Pageable pageable);
    Page<Class> findByActiveFalse(Pageable pageable);
    List<Class> findByUsersContaining(User user);

}
