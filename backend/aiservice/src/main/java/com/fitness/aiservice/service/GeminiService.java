package com.fitness.aiservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

@Service
public class GeminiService {

        private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

        private final WebClient webClient;

        @Value("${gemini.api.url}")
        private String geminiApiUrl;

        @Value("${gemini.api.key}")
        private String geminiApiKey;

        public GeminiService(@Qualifier("geminiWebClient") WebClient webClient) {
                this.webClient = webClient;
        }

        public Mono<String> getAnswer(String question) {

                if (!StringUtils.hasText(geminiApiUrl) || !StringUtils.hasText(geminiApiKey)) {
                        log.error("Gemini API is NOT configured - URL or Key missing");
                        return Mono.error(new IllegalStateException("Gemini API credentials missing"));
                }
                
                log.debug("Gemini API configured - Sending request");


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
                        .timeout(Duration.ofSeconds(30))
                        .doOnError(e -> log.error("Gemini HTTP Error: {}", e.getMessage()))
                        .doOnSuccess(response -> log.debug("Gemini API Response received, length: {}", response.length()));
        }
}
