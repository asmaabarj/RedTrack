package com.redtrack.config;

import com.redtrack.model.Role;
import com.redtrack.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;


@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final MongoTemplate mongoTemplate;

    @PostConstruct
    public void init() {
        if (roleRepository.count() == 0) {
            mongoTemplate.indexOps(Role.class).dropAllIndexes();

            Role roleAdmin = new Role();
            roleAdmin.setName("ADMIN");
            roleRepository.save(roleAdmin);

            Role roleUser = new Role();
            roleUser.setName("USER");
            roleRepository.save(roleUser);
        }
    }
}