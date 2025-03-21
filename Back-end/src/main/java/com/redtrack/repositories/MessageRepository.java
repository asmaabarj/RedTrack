package com.redtrack.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.redtrack.model.entities.Message;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByRoomIdOrderByTimestampAsc(String roomId);
    List<Message> findByExpediteurIdOrDestinataireId(String expediteurId, String destinataireId);
} 