package com.redtrack.controllers.admins;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.UpdateUserRequest;
import com.redtrack.dtos.UserDTO;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;
import com.redtrack.services.interfaces.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @GetMapping("/formateurs")
    public ResponseEntity<Page<UserDTO>> getFormateurs(Pageable pageable) {
        return ResponseEntity.ok(userService.listFormateurs(pageable));
    }

    @GetMapping("/apprenants")
    public ResponseEntity<Page<UserDTO>> getApprenants(Pageable pageable) {
        return ResponseEntity.ok(userService.listApprenants(pageable));
    }

    @PutMapping("/users/{userId}/archive")
    public ResponseEntity<String> archiveUser(@PathVariable String userId) {
        userService.archiveUser(userId);
        return ResponseEntity.ok("Utilisateur archivé avec succès");
    }

    @PutMapping("/users/{userId}/unarchive")
    public ResponseEntity<String> unarchiveUser(@PathVariable String userId) {
        userService.unarchiveUser(userId);
        return ResponseEntity.ok("Utilisateur désarchivé avec succès");
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }

}
