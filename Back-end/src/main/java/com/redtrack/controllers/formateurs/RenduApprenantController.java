package com.redtrack.controllers.formateurs;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.etape.EtapeAvecRendusDTO;
import com.redtrack.dtos.rendu.RenduResponseDTO;
import com.redtrack.dtos.rendu.CreateRenduResponseRequest;
import com.redtrack.services.interfaces.RenduService;
import com.redtrack.services.interfaces.RenduResponseService;

import lombok.RequiredArgsConstructor;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/formateur/apprenants")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('FORMATEUR')")
public class RenduApprenantController {
    private final RenduService renduService;
    private final RenduResponseService renduResponseService;

    @GetMapping("/{apprenantId}/rendus")
    public ResponseEntity<List<EtapeAvecRendusDTO>> getRendusApprenant(@PathVariable String apprenantId) {
        return ResponseEntity.ok(renduService.getEtapesAvecRendusByApprenant(apprenantId));
    }

    @PostMapping("/rendus/{renduId}/responses")
    public ResponseEntity<RenduResponseDTO> createRenduResponse(
            @PathVariable String renduId,
            @Valid @RequestBody CreateRenduResponseRequest request) {
        return ResponseEntity.ok(renduResponseService.createRenduResponse(renduId, request));
    }

    @GetMapping("/rendus/{renduId}/responses")
    public ResponseEntity<List<RenduResponseDTO>> getRenduResponses(@PathVariable String renduId) {
        return ResponseEntity.ok(renduResponseService.getRenduResponses(renduId));
    }
}
