package com.redtrack.controllers.formateurs;

import java.util.List;

import javax.validation.Valid;

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

import com.redtrack.dtos.EtapeDTO;
import com.redtrack.services.interfaces.EtapeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/formateur/etapes")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('FORMATEUR')")
public class EtapeController {
    private final EtapeService etapeService;

    @PostMapping
    public ResponseEntity<EtapeDTO> createEtape(@Valid @RequestBody EtapeDTO etapeDTO) {
        return ResponseEntity.ok(etapeService.createEtape(etapeDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtapeDTO> updateEtape(
            @PathVariable String id,
            @Valid @RequestBody EtapeDTO etapeDTO) {
        return ResponseEntity.ok(etapeService.updateEtape(id, etapeDTO));
    }

    @GetMapping
    public ResponseEntity<List<EtapeDTO>> getAllEtapes() {
        return ResponseEntity.ok(etapeService.getAllEtapes());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtape(@PathVariable String id) {
        etapeService.deleteEtape(id);
        return ResponseEntity.ok().build();
    }
}
