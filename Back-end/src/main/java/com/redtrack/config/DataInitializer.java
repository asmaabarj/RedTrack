package com.redtrack.config;

import javax.annotation.PostConstruct;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.redtrack.model.Role;
import com.redtrack.repositories.RoleRepository;

import lombok.RequiredArgsConstructor;


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

            Role roleFormatteur = new Role();
            roleFormatteur.setName("FORMATTEUR");
            roleRepository.save(roleFormatteur);

            Role roleApprenant = new Role();
            roleApprenant.setName("APPRENANT");
            roleRepository.save(roleApprenant);
        }
    }
}