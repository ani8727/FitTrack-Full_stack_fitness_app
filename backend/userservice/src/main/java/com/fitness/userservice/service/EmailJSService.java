package com.fitness.userservice.service;

import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

/**
 * EmailJS integration deprecated for this trimmed-down userservice.
 * Kept as a placeholder (no external calls) to avoid removing code paths abruptly.
 */
@Deprecated
@Service
public class EmailJSService {

    @Value("${emailjs.service-id}")
    private String serviceId;

    @Value("${emailjs.template-admin}")
    private String templateAdminId;

    @Value("${emailjs.template-user}")
    private String templateUserId;

    @Value("${emailjs.public-key}")
    private String publicKey;

    @Value("${emailjs.admin-email}")
    private String adminEmail;

    private RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public void sendContactFormEmail(String name, String email, String reason, String message) {
        // intentionally no-op in production trimmed service
    }

    private void sendEmail(String templateId, JsonObject templateParams) {
        // no-op
    }
}