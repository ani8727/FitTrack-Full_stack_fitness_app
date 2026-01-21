package com.fitness.userservice.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.fitness.userservice.dto.ContactMessageRequest;
import com.fitness.userservice.model.ContactMessage;
import com.fitness.userservice.repository.ContactMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailJSService emailJSService;
    @Value("${emailjs.enabled:false}")
    private boolean emailjsEnabled;

    public void createMessage(ContactMessageRequest request, String userKeycloakId) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.getName());
        msg.setEmail(request.getEmail());
        msg.setReason(request.getReason());
        msg.setMessage(request.getMessage());
        msg.setUserKeycloakId(userKeycloakId);

        contactMessageRepository.save(msg);
        // Optional: email notification via EmailJS (controlled by config)
        if (emailjsEnabled) {
            try {
                emailJSService.sendContactFormEmail(
                    request.getName(),
                    request.getEmail(),
                    request.getReason(),
                    request.getMessage()
                );
            } catch (Exception e) {
                // Log-only; do not affect API response
            }
        }
    }
}
