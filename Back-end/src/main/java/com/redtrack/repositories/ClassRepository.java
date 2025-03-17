package com.redtrack.repositories;

import com.redtrack.model.entities.Class;
import com.redtrack.model.entities.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClassRepository extends MongoRepository<Class, String> {
    boolean existsByNom(String nom);
    Page<Class> findByActiveTrueOrderByIdDesc(Pageable pageable);
    List<Class> findByUsersContaining(User user);
    Page<Class> findByActiveFalseOrderByIdDesc(Pageable pageable);
    long countByActiveTrue();
}
