package com.fitness.aiservice.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GeminiService {

        private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

        private final WebClient webClient;

        @Value("${gemini.api.url}")
        private String geminiApiUrl;

        @Value("${gemini.api.key}")
        private String geminiApiKey;

        public GeminiService(WebClient.Builder webClientBuilder) {
                this.webClient = webClientBuilder.build();
        }

        @Retry(name = "geminiServiceRetry", fallbackMethod = "fallbackGetAnswer")
        @CircuitBreaker(name = "geminiServiceCircuitBreaker", fallbackMethod = "fallbackGetAnswer")
        public String getAnswer(String question) {
                logger.info("Attempting to get answer for question: {}", question);
                Map<String, Object> requestBody = Map.of(
                                "contents", new Object[] {
                                                Map.of("parts", new Object[] {
                                                                Map.of("text", question)
                                                })
                                });

                try {
                        String response = webClient.post()
                                        .uri(geminiApiUrl + geminiApiKey)
                                        .header("Content-Type", "application/json")
                                        .bodyValue(requestBody)
                                        .retrieve()
                                        .bodyToMono(String.class)
                                        .block();

                        logger.info("Received response: {}", response);
                        return response == null ? "" : response;
                } catch (WebClientResponseException.NotFound e) {
                        logger.error("API endpoint not found: {}", e.getMessage(), e);
                        throw new RuntimeException("API endpoint not found: " + e.getMessage(), e);
                } catch (Exception e) {
                        logger.error("An unexpected error occurred: {}", e.getMessage(), e);
                        throw new RuntimeException("An unexpected error occurred: " + e.getMessage(), e);
                }
        }

        private String fallbackGetAnswer(String question, Throwable throwable) {
                logger.warn("Fallback method triggered for question: {}. Reason: {}", question, throwable.getMessage());
                return "Service is currently unavailable. Please try again later.";
        }
}
