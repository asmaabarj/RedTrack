package com.redtrack.controllers;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.redtrack.dtos.message.MessageDTO;
import com.redtrack.dtos.message.RoomDTO;
import com.redtrack.services.interfaces.MessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/room")
    public RoomDTO creerOuTrouverRoom(
            @RequestParam String formateurId,
            @RequestParam String apprenantId,
            @RequestParam String classeId) {
        return messageService.creerOuTrouverRoom(formateurId, apprenantId, classeId);
    }

    @MessageMapping("/chat")
    public void envoyerMessage(@Payload MessageDTO messageDTO) {
        messageService.envoyerMessage(
            messageDTO.getExpediteurId(),
            messageDTO.getDestinataireId(),
            messageDTO.getClasseId(),
            messageDTO.getContenu()
        );
    }

    @GetMapping("/conversations/{formateurId}/{apprenantId}/{classeId}")
    public List<MessageDTO> getMessagesParRoom(
            @PathVariable String formateurId,
            @PathVariable String apprenantId,
            @PathVariable String classeId) {
        return messageService.getMessagesParRoom(formateurId, apprenantId, classeId);
    }

    @GetMapping("/conversations/{userId}")
    public List<MessageDTO> getConversations(@PathVariable String userId) {
        return messageService.getConversations(userId);
    }
} 