package com.redtrack.repositories;

import com.redtrack.model.entities.Class;
import com.redtrack.model.entities.User;
import com.redtrack.model.enums.Role;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Page<User> findByRoleAndActiveFalseOrderByIdDesc(Role role, Pageable pageable);
    Page<User> findByRoleAndActiveTrueOrderByIdDesc(Role role, Pageable pageable);
    long countByRoleAndActiveTrue(Role role);
    Page<User> findByClassesInAndRoleAndActiveTrueOrderByIdDesc(List<Class> classes, Role role, Pageable pageable);
    Page<User> findByClassesInAndRoleAndActiveFalseOrderByIdDesc(List<Class> classes, Role role, Pageable pageable);
}