package com.redtrack.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.redtrack.dtos.message.MessageDTO;
import com.redtrack.dtos.message.RoomDTO;
import com.redtrack.exceptions.ClassException;
import com.redtrack.exceptions.UserException;
import com.redtrack.mappers.MessageMapper;
import com.redtrack.mappers.RoomMapper;
import com.redtrack.model.entities.Class;
import com.redtrack.model.entities.Message;
import com.redtrack.model.entities.Room;
import com.redtrack.model.entities.User;
import com.redtrack.repositories.ClassRepository;
import com.redtrack.repositories.MessageRepository;
import com.redtrack.repositories.RoomRepository;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.MessageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final MessageMapper messageMapper;
    private final RoomMapper roomMapper;
    private final SimpMessagingTemplate messagingTemplate;

    private String generateRoomId(String formateurId, String apprenantId, String classeId) {
        return String.format("%s_%s_%s", formateurId, apprenantId, classeId);
    }

    @Override
    public RoomDTO creerOuTrouverRoom(String formateurId, String apprenantId, String classeId) {
        User formateur = userRepository.findById(formateurId)
                .orElseThrow(() -> new UserException("Formateur non trouvé avec l'ID: " + formateurId));
        User apprenant = userRepository.findById(apprenantId)
                .orElseThrow(() -> new UserException("Apprenant non trouvé avec l'ID: " + apprenantId));
        Class classe = classRepository.findById(classeId)
                .orElseThrow(() -> new ClassException("Classe non trouvée avec l'ID: " + classeId));

        Room room = roomRepository
            .findByFormateurAndApprenantAndClasse(formateur, apprenant, classe)
            .orElseGet(() -> {
                Room newRoom = new Room();
                newRoom.setFormateur(formateur);
                newRoom.setApprenant(apprenant);
                newRoom.setClasse(classe);
                return roomRepository.save(newRoom);
            });

        return roomMapper.roomToRoomDTO(room);
    }

    @Override
    public MessageDTO envoyerMessage(String formateurId, String apprenantId, String classeId, String contenu) {
        User expediteur = userRepository.findById(formateurId)
                .orElseThrow(() -> new UserException("Expéditeur non trouvé"));
        User destinataire = userRepository.findById(apprenantId)
                .orElseThrow(() -> new UserException("Destinataire non trouvé"));
        Class classe = classRepository.findById(classeId)
                .orElseThrow(() -> new ClassException("Classe non trouvée"));

        String roomId = generateRoomId(formateurId, apprenantId, classeId);

        Message message = new Message();
        message.setContenu(contenu);
        message.setTimestamp(LocalDateTime.now());
        message.setRoomId(roomId);
        message.setExpediteur(expediteur);
        message.setDestinataire(destinataire);
        message.setClasse(classe);

        Message savedMessage = messageRepository.save(message);
        MessageDTO savedMessageDTO = messageMapper.messageToMessageDTO(savedMessage);
        
        messagingTemplate.convertAndSend("/topic/room/" + roomId, savedMessageDTO);
        
        return savedMessageDTO;
    }

    @Override
    public List<MessageDTO> getMessagesParRoom(String formateurId, String apprenantId, String classeId) {
        String roomId = generateRoomId(formateurId, apprenantId, classeId);
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomId)
                .stream()
                .map(messageMapper::messageToMessageDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomDTO> getRoomsPourUtilisateur(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("Utilisateur non trouvé avec l'ID: " + userId));
        return roomRepository.findByFormateurOrApprenant(user, user)
                .stream()
                .map(roomMapper::roomToRoomDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getConversations(String userId) {
        return messageRepository.findByExpediteurIdOrDestinataireId(userId, userId)
                .stream()
                .map(messageMapper::messageToMessageDTO)
                .collect(Collectors.toList());
    }
} 