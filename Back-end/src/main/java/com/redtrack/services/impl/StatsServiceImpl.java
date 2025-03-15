package com.redtrack.services.impl;

import org.springframework.stereotype.Service;

import com.redtrack.dtos.stats.StatsDTO;
import com.redtrack.model.enums.Role;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.StatsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {
    private final UserRepository userRepository;
    private final ClassRepository classRepository;

    @Override
    public StatsDTO getStats() {
        long activeFormateurs = userRepository.countByRoleAndActiveTrue(Role.FORMATEUR);
        long activeApprenants = userRepository.countByRoleAndActiveTrue(Role.APPRENANT);
        long activeClasses = classRepository.countByActiveTrue();

        return new StatsDTO(activeFormateurs, activeApprenants, activeClasses);
    }
} 