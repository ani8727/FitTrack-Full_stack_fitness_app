package com.fitness.activityservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    // Direct URL for local/dev to avoid service discovery dependency
    @Bean
    public WebClient apiGatewayWebClient(@Value("${API_GATEWAY_URL:https://fittrack-gateway.onrender.com}") String apiGatewayUrl) {
        return WebClient.builder()
                .baseUrl(apiGatewayUrl)
                .build();
    }
}
