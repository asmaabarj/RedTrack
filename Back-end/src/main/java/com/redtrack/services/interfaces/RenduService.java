package com.redtrack.services.interfaces;

import java.util.List;

import com.redtrack.dtos.RenduDTO;

public interface RenduService {
    RenduDTO createRendu(RenduDTO renduDTO);
    List<RenduDTO> getMesRendus();
}