package com.redtrack.controllers.admins;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.stats.StatsDTO;
import com.redtrack.services.interfaces.StatsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class StatsController {
    private final StatsService statsService;

    @GetMapping
    public ResponseEntity<StatsDTO> getStats() {
        return ResponseEntity.ok(statsService.getStats());
    }
} 