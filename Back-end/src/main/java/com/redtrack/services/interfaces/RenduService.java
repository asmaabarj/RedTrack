package com.redtrack.services.interfaces;

import java.util.List;

import com.redtrack.dtos.RenduDTO;
import com.redtrack.dtos.EtapeAvecRendusDTO;

public interface RenduService {
    RenduDTO createRendu(RenduDTO renduDTO);
    List<EtapeAvecRendusDTO> getMesEtapesAvecRendus();
    List<EtapeAvecRendusDTO> getEtapesAvecRendusByApprenant(String apprenantId);
}