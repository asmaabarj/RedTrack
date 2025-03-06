package com.redtrack.services.interfaces;

import java.util.List;

import com.redtrack.dtos.etape.EtapeDTO;

public interface EtapeService {
    EtapeDTO createEtape(EtapeDTO etapeDTO);
    EtapeDTO updateEtape(String id, EtapeDTO etapeDTO);
    List<EtapeDTO> getAllEtapes();
    List<EtapeDTO> getEtapesForCurrentApprenant();
}
