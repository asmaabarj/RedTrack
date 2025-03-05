package com.redtrack.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.redtrack.model.Class;
import com.redtrack.model.Role;
import com.redtrack.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Page<User> findByRoleAndActiveTrue(Role role, Pageable pageable);
    Page<User> findByClasseAndRoleAndActiveTrue(Class classe, Role role, Pageable pageable);
    List<User> findByClasseAndActiveTrue(Class classe);
}