package com.redtrack.services.interfaces;

import com.redtrack.dtos.rendu.RenduResponseDTO;
import com.redtrack.dtos.rendu.CreateRenduResponseRequest;
import java.util.List;

public interface RenduResponseService {
    RenduResponseDTO createRenduResponse(String renduId, CreateRenduResponseRequest request);
    List<RenduResponseDTO> getRenduResponses(String renduId);
}
