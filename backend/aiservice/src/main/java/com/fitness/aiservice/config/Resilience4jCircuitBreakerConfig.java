package com.fitness.aiservice.config;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class Resilience4jCircuitBreakerConfig {

    private static final Logger logger = LoggerFactory.getLogger(Resilience4jCircuitBreakerConfig.class);

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        CircuitBreakerRegistry registry = CircuitBreakerRegistry.of(baseCircuitBreakerConfig());
        registry.getEventPublisher()
                .onEntryAdded(event -> logger.info("Circuit Breaker added: {}", event.getAddedEntry().getName()))
                .onEntryRemoved(event -> logger.info("Circuit Breaker removed: {}", event.getRemovedEntry().getName()));
        return registry;
    }

    @Bean
    public CircuitBreakerConfig baseCircuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
                .failureRateThreshold(50.0f)
                .slowCallRateThreshold(50.0f)
                .slowCallDurationThreshold(Duration.ofSeconds(2))
                .permittedNumberOfCallsInHalfOpenState(3)
                .automaticTransitionFromOpenToHalfOpenEnabled(true)
                .waitDurationInOpenState(Duration.ofSeconds(10))
                .recordExceptions(Exception.class)
                .ignoreExceptions()
                .build();
    }

    @Bean
    public CircuitBreaker userServiceCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("userService", baseCircuitBreakerConfig());
    }
}
