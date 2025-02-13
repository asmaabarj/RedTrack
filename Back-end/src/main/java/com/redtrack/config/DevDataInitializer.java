package com.redtrack.config;


import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.redtrack.model.Role;
import com.redtrack.model.User;
import com.redtrack.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DevDataInitializer {

    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        mongoTemplate.getDb().drop();

        // Création des utilisateurs
        User adminUser = new User();
        adminUser.setEmail("admin@gmail.com");
        adminUser.setNom("admin");
        adminUser.setPrenom("admin");
        adminUser.setActive(true);
        adminUser.setPassword(passwordEncoder.encode("admin"));
        adminUser.setRole(Role.ADMIN);  
        userRepository.save(adminUser);

        User formatteurlUser = new User();
        formatteurlUser.setEmail("Formatteur@gmail.com");
        formatteurlUser.setPrenom("formatteur");
        formatteurlUser.setNom("formatteur");
        formatteurlUser.setActive(true);
        formatteurlUser.setPassword(passwordEncoder.encode("formatteur"));
        formatteurlUser.setRole(Role.FORMATTEUR);
        userRepository.save(formatteurlUser);

        //création d'un utilisateur apprenant de test
        User apprenantUser =new User();
        apprenantUser.setEmail("apprenant@gmail.com");
        apprenantUser.setPrenom("apprenant");
        apprenantUser.setNom("apprenant");
        apprenantUser.setActive(true);
        apprenantUser.setPassword(passwordEncoder.encode("apprenant"));
        apprenantUser.setRole(Role.APPRENANT);
        userRepository.save(apprenantUser);
    }

}