package com.redtrack.controllers.formateurs;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.ClassDTO;
import com.redtrack.dtos.CreateClassRequest;
import com.redtrack.services.interfaces.ClassService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/formateur/classes")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('FORMATEUR')")
public class ClassFormateurController {
    private final ClassService classService;

    @GetMapping("/own")
    public ResponseEntity<ClassDTO> getOwnClass() {
        return ResponseEntity.ok(classService.getFormateurOwnClass());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassDTO> updateClass(
            @PathVariable String id,
            @Valid @RequestBody CreateClassRequest request) {
        return ResponseEntity.ok(classService.updateFormateurClass(id, request));
    }
}
