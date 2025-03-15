package com.redtrack.dtos.stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatsDTO {
    private long activeFormateurs;
    private long activeApprenants;
    private long activeClasses;
} 