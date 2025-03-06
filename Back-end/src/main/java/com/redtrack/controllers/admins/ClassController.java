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

import com.redtrack.dtos.classe.ClassDTO;
import com.redtrack.dtos.classe.ClassDetailsDTO;
import com.redtrack.dtos.classe.CreateClassRequest;
import com.redtrack.services.interfaces.ClassService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/classes")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class ClassController {
    private final ClassService classService;

    @PostMapping
    public ResponseEntity<ClassDTO> createClass(@Valid @RequestBody CreateClassRequest request) {
        return ResponseEntity.ok(classService.createClass(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassDTO> getClass(@PathVariable String id) {
        return ResponseEntity.ok(classService.getClass(id));
    }

    @GetMapping
    public ResponseEntity<Page<ClassDTO>> getAllClasses(Pageable pageable) {
        return ResponseEntity.ok(classService.getAllClasses(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassDTO> updateClass(
            @PathVariable String id,
            @Valid @RequestBody CreateClassRequest request) {
        return ResponseEntity.ok(classService.updateClass(id, request));
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<String> archiveClass(@PathVariable String id) {
        classService.archiveClass(id);
        return ResponseEntity.ok("Classe archivée avec succès");
    }

    @PutMapping("/{id}/unarchive")
    public ResponseEntity<String> unarchiveClass(@PathVariable String id) {
        classService.unarchiveClass(id);
        return ResponseEntity.ok("Classe désarchivée avec succès");
    }

    @GetMapping("/archived")
    public ResponseEntity<Page<ClassDTO>> getArchivedClasses(Pageable pageable) {
        return ResponseEntity.ok(classService.getArchivedClasses(pageable));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ClassDetailsDTO> getClassDetails(@PathVariable String id) {
        return ResponseEntity.ok(classService.getClassDetails(id));
    }

}
