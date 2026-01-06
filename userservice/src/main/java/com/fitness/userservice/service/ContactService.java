package com.fitness.userservice.service;

import org.springframework.stereotype.Service;

import com.fitness.userservice.dto.ContactMessageRequest;
import com.fitness.userservice.model.ContactMessage;
import com.fitness.userservice.repository.ContactMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public void createMessage(ContactMessageRequest request, String userKeycloakId) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.getName());
        msg.setEmail(request.getEmail());
        msg.setReason(request.getReason());
        msg.setMessage(request.getMessage());
        msg.setUserKeycloakId(userKeycloakId);

        contactMessageRepository.save(msg);
    }
}
