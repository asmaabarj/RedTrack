package com.redtrack.services.interfaces;

import com.redtrack.dtos.RenduResponseDTO;
import com.redtrack.dtos.CreateRenduResponseRequest;
import java.util.List;

public interface RenduResponseService {
    RenduResponseDTO createRenduResponse(String renduId, CreateRenduResponseRequest request);
    List<RenduResponseDTO> getRenduResponses(String renduId);
}
