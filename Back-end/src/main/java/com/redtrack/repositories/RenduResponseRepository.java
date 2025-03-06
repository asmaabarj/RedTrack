package com.redtrack.repositories;

import com.redtrack.model.entities.RenduResponse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RenduResponseRepository extends MongoRepository<RenduResponse, String> {
    List<RenduResponse> findByRenduIdOrderByDateSoumissionDesc(String renduId);
}
