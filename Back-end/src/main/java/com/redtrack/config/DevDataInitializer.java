package com.redtrack.config;

import com.redtrack.model.Role;
import com.redtrack.model.User;
import com.redtrack.repositories.RoleRepository;
import com.redtrack.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DevDataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        mongoTemplate.getDb().drop();

        // Création des rôles
        Role roleAdmin = new Role();
        roleAdmin.setName("ADMIN");
        roleRepository.save(roleAdmin);

        Role roleUser = new Role();
        roleUser.setName("USER");
        roleRepository.save(roleUser);

        // Création d'un utilisateur admin de test
        User adminUser = new User();
        adminUser.setLogin("admin");
        adminUser.setPassword(passwordEncoder.encode("admin"));
        adminUser.setRoles(Arrays.asList(roleAdmin));
        adminUser.setActive(true);
        userRepository.save(adminUser);

        // Création d'un utilisateur normal de test
        User normalUser = new User();
        normalUser.setLogin("user");
        normalUser.setPassword(passwordEncoder.encode("user"));
        normalUser.setRoles(Arrays.asList(roleUser));
        normalUser.setActive(true);
        userRepository.save(normalUser);


}