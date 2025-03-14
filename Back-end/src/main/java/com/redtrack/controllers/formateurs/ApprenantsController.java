package com.redtrack.controllers.formateurs;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.user.CreateApprenantRequest;
import com.redtrack.dtos.user.UpdateApprenantRequest;
import com.redtrack.dtos.user.UserDTO;
import com.redtrack.services.interfaces.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/formateur/apprenants")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('FORMATEUR')")
public class ApprenantsController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserDTO>> getClassApprenants(Pageable pageable) {
        return ResponseEntity.ok(userService.getFormateurClassApprenants(pageable));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createApprenant(@Valid @RequestBody CreateApprenantRequest request) {
        return ResponseEntity.ok(userService.createApprenantInFormateurClass(request));
    }

    @PutMapping("/{apprenantId}/archive")
    public ResponseEntity<String> archiveApprenant(@PathVariable String apprenantId) {
        userService.archiveApprenantByFormateur(apprenantId);
        return ResponseEntity.ok("Apprenant archivé avec succès");
    }

    @PutMapping("/{apprenantId}/unarchive")
    public ResponseEntity<String> unarchiveApprenant(@PathVariable String apprenantId) {
        userService.unarchiveApprenantByFormateur(apprenantId);
        return ResponseEntity.ok("Apprenant désarchivé avec succès");
    }

    @PutMapping("/{apprenantId}")
    public ResponseEntity<UserDTO> updateApprenant(
            @PathVariable String apprenantId,
            @Valid @RequestBody UpdateApprenantRequest request) {
        return ResponseEntity.ok(userService.updateApprenantByFormateur(apprenantId, request));
    }

    @GetMapping("/archives")
    public ResponseEntity<Page<UserDTO>> getFormateurArchivedApprenants(
            @PageableDefault(size = 10, sort = "nom") Pageable pageable) {
        return ResponseEntity.ok(userService.getFormateurArchivedApprenants(pageable));
    }
}
