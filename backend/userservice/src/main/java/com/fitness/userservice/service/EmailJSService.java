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

@Service
@RequiredArgsConstructor
@Slf4j
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
        try {
            // Admin notification
            JsonObject adminParams = new JsonObject();
            adminParams.addProperty("user_name", name);
            adminParams.addProperty("user_email", email);
            adminParams.addProperty("reason", reason);
            adminParams.addProperty("message", message);
            adminParams.addProperty("admin_email", adminEmail);
            adminParams.addProperty("timestamp", System.currentTimeMillis());
            sendEmail(templateAdminId, adminParams);

            // User confirmation
            JsonObject userParams = new JsonObject();
            userParams.addProperty("user_name", name);
            userParams.addProperty("user_email", email);
            userParams.addProperty("reason", reason);
            userParams.addProperty("message", message);
            userParams.addProperty("timestamp", System.currentTimeMillis());
            sendEmail(templateUserId, userParams);

            log.info("EmailJS: sent contact emails for {}", email);
        } catch (Exception ex) {
            // Non-blocking: log and continue
            log.error("EmailJS: failed to send contact emails", ex);
        }
    }

    private void sendEmail(String templateId, JsonObject templateParams) {
        try {
            JsonObject request = new JsonObject();
            request.addProperty("service_id", serviceId);
            request.addProperty("template_id", templateId);
            request.addProperty("user_id", publicKey);
            request.add("template_params", templateParams);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(request.toString(), headers);

            restTemplate().postForObject(
                "https://api.emailjs.com/api/v1.0/email/send",
                entity,
                String.class
            );
        } catch (Exception e) {
            log.error("EmailJS: failed to send template {}", templateId, e);
        }
    }
}