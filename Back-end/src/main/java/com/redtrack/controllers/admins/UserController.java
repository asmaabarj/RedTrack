package com.redtrack.controllers.admins;

import javax.validation.Valid;

import com.redtrack.dtos.classe.ClassDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.user.UpdateUserRequest;
import com.redtrack.dtos.user.UserDTO;
import com.redtrack.dtos.auth.RegisterRequest;
import com.redtrack.dtos.auth.RegisterResponse;
import com.redtrack.services.interfaces.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

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

    @GetMapping("/formateurs/archives")
    public ResponseEntity<Page<UserDTO>> getFormateursArchives(Pageable pageable) {
        return ResponseEntity.ok(userService.listFormateursArchives(pageable));
    }

    @GetMapping("/apprenants/archives")
    public ResponseEntity<Page<UserDTO>> getApprenantsArchives(Pageable pageable) {
        return ResponseEntity.ok(userService.listApprenantsArchives(pageable));
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

    @PostMapping("/users/{userId}/classes/{classId}")
    public ResponseEntity<String> assignUserToClass(
            @PathVariable String userId,
            @PathVariable String classId) {
        userService.assignUserToClass(userId, classId);
        return ResponseEntity.ok("Utilisateur assigné à la classe avec succès");
    }

    @DeleteMapping("/users/{userId}/classes/{classId}")
    public ResponseEntity<String> removeUserFromClass(
            @PathVariable String userId,
            @PathVariable String classId) {
        userService.removeUserFromClass(userId, classId);
        return ResponseEntity.ok("Utilisateur retiré de la classe avec succès");
    }

    @GetMapping("/users/{userId}/classes")
    public ResponseEntity<List<ClassDTO>> getUserClasses(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserClasses(userId));
    }

    @GetMapping("/classes/{classId}/users")
    public ResponseEntity<List<UserDTO>> getClassUsers(@PathVariable String classId) {
        return ResponseEntity.ok(userService.getClassUsers(classId));
    }

    @PutMapping("/users/{userId}/classes/{oldClassId}/{newClassId}")
    public ResponseEntity<String> updateUserClass(
            @PathVariable String userId,
            @PathVariable String oldClassId,
            @PathVariable String newClassId) {
        userService.updateUserClass(userId, oldClassId, newClassId);
        return ResponseEntity.ok("Classe de l'utilisateur mise à jour avec succès");
    }
}
