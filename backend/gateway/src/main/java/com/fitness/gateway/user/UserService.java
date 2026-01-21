package com.fitness.gateway.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class UserService {
    private final WebClient userServiceWebClient;

    // Constructor for dependency injection with configurable base URL
    @Autowired
    public UserService(@Value("${services.user-service.url:http://localhost:8081}") String userServiceUrl) {
        this.userServiceWebClient = WebClient.builder()
            .baseUrl(userServiceUrl)
            .build();
    }

    // Constructor for testing with custom WebClient
    public UserService(WebClient userServiceWebClient) {
        this.userServiceWebClient = userServiceWebClient;
    }

    public Mono<Boolean> validateUser(String userId) {
        return userServiceWebClient.get()
                .uri("/api/users/{userId}/validate", userId)
                .headers(headers -> headers.remove(HttpHeaders.AUTHORIZATION))
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND)
                        return Mono.error(new RuntimeException("User Not Found: " + userId));
                    else if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                        return Mono.error(new RuntimeException("Invalid Request: " + userId));
                    return Mono.error(new RuntimeException("Unexpected error: " + e.getMessage()));
                });
    }

    public Mono<UserResponse> registerUser(RegisterRequest request) {
        return userServiceWebClient.post()
                .uri("/api/users/register")
                .headers(headers -> headers.remove(HttpHeaders.AUTHORIZATION))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                        return Mono.error(new RuntimeException("Bad Request: " + e.getMessage()));
                    else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR)
                        return Mono.error(new RuntimeException("Internal Server Error: " + e.getMessage()));
                    return Mono.error(new RuntimeException("Unexpected error: " + e.getMessage()));
                });
    }
}