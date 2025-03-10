package com.redtrack.controllers.apprenants;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.rendu.RenduDTO;
import com.redtrack.dtos.etape.EtapeAvecRendusDTO;
import com.redtrack.services.interfaces.RenduService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/apprenant/rendus")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('APPRENANT')")
public class RenduController {
    private final RenduService renduService;

    @PostMapping
    public ResponseEntity<RenduDTO> createRendu(@Valid @RequestBody RenduDTO renduDTO) {
        return ResponseEntity.ok(renduService.createRendu(renduDTO));
    }


    @GetMapping("/etapes")
    public ResponseEntity<List<EtapeAvecRendusDTO>> getMesEtapesAvecRendus() {
        return ResponseEntity.ok(renduService.getMesEtapesAvecRendus());
    }
} 