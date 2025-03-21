package com.redtrack.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.redtrack.model.entities.Room;
import com.redtrack.model.entities.User;
import com.redtrack.model.entities.Class;

public interface RoomRepository extends MongoRepository<Room, String> {
    Optional<Room> findByFormateurAndApprenantAndClasse(User formateur, User apprenant, Class classe);
    List<Room> findByFormateurOrApprenant(User formateur, User apprenant);
} 