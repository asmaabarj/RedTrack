package com.redtrack.controllers.apprenants;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.etape.EtapeDTO;
import com.redtrack.services.interfaces.EtapeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/apprenant/etapes")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('APPRENANT')")
public class EtapeApprenantController {
    private final EtapeService etapeService;

    @GetMapping
    public ResponseEntity<List<EtapeDTO>> getEtapesForApprenant() {
        return ResponseEntity.ok(etapeService.getEtapesForCurrentApprenant());
    }
} 