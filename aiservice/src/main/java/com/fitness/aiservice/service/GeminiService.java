package com.fitness.aiservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

@Service
public class GeminiService {

        private final WebClient webClient;

        @Value("${gemini.api.url}")
        private String geminiApiUrl;

        @Value("${gemini.api.key}")
        private String geminiApiKey;

        public GeminiService(WebClient.Builder webClientBuilder) {
                this.webClient = webClientBuilder.build();
        }

        public Mono<String> getAnswer(String question) {

                Map<String, Object> requestBody = Map.of(
                        "contents", new Object[]{
                                Map.of("parts", new Object[]{
                                        Map.of("text", question)
                                })
                        }
                );

                return webClient.post()
                        .uri(geminiApiUrl + "?key=" + geminiApiKey)
                        .header("Content-Type", "application/json")
                        .bodyValue((requestBody != null) ? requestBody : Map.of())
                        .retrieve()
                        .bodyToMono(String.class)
                        .timeout(Duration.ofSeconds(30)) // increased timeout for AI response
                        .doOnError(e -> System.err.println("Gemini API Error: " + e.getMessage()));
        }
}
