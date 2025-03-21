package com.redtrack.services.interfaces;

import java.util.List;

import com.redtrack.dtos.message.MessageDTO;
import com.redtrack.dtos.message.RoomDTO;

public interface MessageService {
    MessageDTO envoyerMessage(String formateurId, String apprenantId, String classeId, String contenu);
    List<MessageDTO> getMessagesParRoom(String formateurId, String apprenantId, String classeId);
    List<MessageDTO> getConversations(String userId);
    List<RoomDTO> getRoomsPourUtilisateur(String userId);
    RoomDTO creerOuTrouverRoom(String formateurId, String apprenantId, String classeId);
} 