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

        Role roleFormatteur = new Role();
        roleFormatteur.setName("FORMATTEUR");
        roleRepository.save(roleFormatteur);

        Role roleApprenant = new Role();
        roleApprenant.setName("APPRENANT");
        roleRepository.save(roleApprenant);

        // Création d'un utilisateur admin de test
        User adminUser = new User();
        adminUser.setEmail("admin@gmail.com");
        adminUser.setNom("admin");
        adminUser.setPrenom("admin");
        adminUser.setActive(true);
        adminUser.setPassword(passwordEncoder.encode("admin"));
        adminUser.setRoles(Arrays.asList(roleAdmin));
        userRepository.save(adminUser);

        // Création d'un utilisateur formatteur de test
        User formatteurlUser = new User();
        formatteurlUser.setEmail("Formatteur@gmail.com");
        formatteurlUser.setPrenom("formatteur");
        formatteurlUser.setNom("formatteur");
        formatteurlUser.setActive(true);
        formatteurlUser.setPassword(passwordEncoder.encode("formatteur"));
        formatteurlUser.setRoles(Arrays.asList(roleFormatteur));
        userRepository.save(formatteurlUser);


        //création d'un utilisateur apprenant de test
        User apprenantUser =new User();
        apprenantUser.setEmail("apprenant@gmail.com");
        apprenantUser.setPrenom("apprenant");
        apprenantUser.setNom("apprenant");
        apprenantUser.setActive(true);
        apprenantUser.setPassword(passwordEncoder.encode("apprenant"));
        apprenantUser.setRoles(Arrays.asList(roleApprenant));
        userRepository.save(apprenantUser)


    }

}