package com.fitness.activityservice.service;

import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserValidationService {
    private final WebClient apiGatewayWebClient;

    public boolean validateUser(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        if (userId == null || userId.isBlank()) {
            return false;
        }

        try {
            // userservice returns JSON like: {"valid": true}
            Map<String, Object> resp = apiGatewayWebClient.get()
                .uri("/users/{userId}/validate", userId)
                .header("X-Service-ID", "activity-service")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

            if (resp == null) {
                return false;
            }

            Object valid = resp.get("valid");
            if (valid instanceof Boolean b) {
                return b;
            }
            if (valid instanceof String s) {
                return Boolean.parseBoolean(s);
            }
            return false;
        } catch (WebClientResponseException e) {
            // Any 4xx/5xx from userservice/gateway should not break activity tracking.
            log.warn("User validation failed (status={}): {}", e.getStatusCode(), e.getMessage());
            return false;
        } catch (Exception e) {
            // Includes JSON decoding issues, timeouts, etc.
            log.warn("User validation failed (exception): {}", e.toString());
            return false;
        }
    }
}