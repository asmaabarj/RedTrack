package com.redtrack.config;

import com.redtrack.model.enums.Role;
import com.redtrack.model.entities.User;
import com.redtrack.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.findByEmail("admin@redtrack.com").isPresent()) {
            User admin = new User();
            admin.setEmail("admin@redtrack.com");
                admin.setPassword(passwordEncoder.encode("Admin123!"));
            admin.setNom("Admin");
            admin.setPrenom("Super");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
        }
    }
} 