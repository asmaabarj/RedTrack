package com.redtrack.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.redtrack.model.entities.Class;
import com.redtrack.model.enums.Role;
import com.redtrack.model.entities.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Page<User> findByRoleAndActiveTrue(Role role, Pageable pageable);
    Page<User> findByRoleAndActiveFalse(Role role, Pageable pageable);
    Page<User> findByClassesInAndRoleAndActiveTrue(List<Class> classes, Role role, Pageable pageable);
    Page<User> findByClassesInAndRoleAndActiveFalse(List<Class> classes, Role role, Pageable pageable);
}