package com.fitness.aiservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }

    // Direct URL for local/dev to avoid service discovery dependency
    @Bean
    public WebClient apiGatewayWebClient(@Value("${API_GATEWAY_URL:http://localhost:8085}") String apiGatewayUrl) {
        return WebClient.builder()
                .baseUrl(apiGatewayUrl)
                .build();
    }

    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder().build();
    }
}