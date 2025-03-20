package com.redtrack.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.redtrack.dtos.auth.LoginRequest;
import com.redtrack.model.entities.User;
import com.redtrack.model.enums.Role;

class AuthControllerIntegrationTest extends AbstractIntegrationTest {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private WebApplicationContext context;
    
    private User testUser;
    private LoginRequest validLoginRequest;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();
            
        etapeRepository.deleteAll();
        classRepository.deleteAll();
        userRepository.deleteAll();
        
        testUser = new User();
        testUser.setEmail("test@test.com");
        testUser.setPassword(passwordEncoder.encode("password123"));
        testUser.setRole(Role.FORMATEUR);
        testUser.setActive(true);
        testUser.setNom("Test");
        testUser.setPrenom("User");
        userRepository.save(testUser);
        
        validLoginRequest = new LoginRequest();
        validLoginRequest.setEmail("test@test.com");
        validLoginRequest.setPassword("password123");
    }

    @Test
    void testLoginSuccess() throws Exception {
        ResultActions result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)));
                
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.token", notNullValue()))
              .andExpect(jsonPath("$.role", is("FORMATEUR")));
    }

    @Test
    void testLoginWithInvalidCredentials() throws Exception {
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setEmail("invalid@test.com");
        invalidRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isForbidden()) 
                .andExpect(jsonPath("$.message").value("Utilisateur non trouvé"));
    }


    @Test
    void testLogout() throws Exception {
        ResultActions loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)));
                
        String token = objectMapper.readTree(loginResult.andReturn()
                .getResponse().getContentAsString()).get("token").asText();

        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void testGetCurrentUserProfile() throws Exception {
        ResultActions loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validLoginRequest)));
                
        String token = objectMapper.readTree(loginResult.andReturn()
                .getResponse().getContentAsString()).get("token").asText();

        mockMvc.perform(get("/api/auth/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(testUser.getEmail()))
                .andExpect(jsonPath("$.nom").value(testUser.getNom()))
                .andExpect(jsonPath("$.prenom").value(testUser.getPrenom()));
    }

    @Test
    @WithMockUser(username = "test@test.com", roles = "FORMATEUR")
    void testGetCurrentUserProfileWithMockUser() throws Exception {
        mockMvc.perform(get("/api/auth/profile")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(testUser.getEmail()))
                .andExpect(jsonPath("$.nom").value(testUser.getNom()))
                .andExpect(jsonPath("$.prenom").value(testUser.getPrenom()));
    }
}
