package com.fitness.gateway;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import reactor.core.publisher.Mono;

// ...existing code...

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri:}")
    private String jwkSetUri;

    private static List<String> parseAllowedOrigins() {
        String raw = System.getenv().getOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173,https://app.fittrack.com");
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
    }

    @Bean
    @Order(0)
    public SecurityWebFilterChain publicEndpointsFilterChain() {
        return ServerHttpSecurity.http()
                .securityMatcher(ServerWebExchangeMatchers.pathMatchers(
                    "/api/activities",
                    "/api/activities/**",
                    "/api/activities/stats",
                    "/api/recommendations/**",
                    "/api/users/register",
                    "/api/contact"))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
            .authorizeExchange(exchange -> exchange.anyExchange().permitAll())
            .exceptionHandling(e -> e.authenticationEntryPoint((exchange, ex) -> Mono.empty()))
                .build();
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        var exchange = http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exch -> exch
                    .pathMatchers("/actuator/**").permitAll()
                    .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .pathMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                    .pathMatchers(HttpMethod.POST, "/api/contact").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/activities/**").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/activities/stats").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/recommendations/**").permitAll()
                    // Allow service-to-service communication with X-Service-ID header for all user endpoints
                    .pathMatchers(HttpMethod.GET, "/api/users/**").access((authentication, context) -> {
                        String serviceId = context.getExchange().getRequest().getHeaders().getFirst("X-Service-ID");
                        if (serviceId != null && !serviceId.isBlank()) {
                            return Mono.just(new AuthorizationDecision(true));
                        }
                        return authentication.map(auth -> new AuthorizationDecision(auth.isAuthenticated()));
                    })
                    // Allow service-to-service communication with X-Service-ID header for other endpoints
                    .anyExchange().access((authentication, context) -> {
                        String serviceId = context.getExchange().getRequest().getHeaders().getFirst("X-Service-ID");
                        if (serviceId != null && !serviceId.isBlank()) {
                            return Mono.just(new AuthorizationDecision(true));
                        }
                        return authentication.map(auth -> new AuthorizationDecision(auth.isAuthenticated()));
                    }));
        
        // Only configure OAuth2 JWT if the JWK Set URI is configured
        if (jwkSetUri != null && !jwkSetUri.isBlank()) {
            exchange.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtDecoder(jwtDecoder())));
        }
        
        return exchange.build();
    }

    @Bean
    @ConditionalOnProperty(name = "spring.security.oauth2.resourceserver.jwt.jwk-set-uri")
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(parseAllowedOrigins());
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization", "X-User-ID"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}