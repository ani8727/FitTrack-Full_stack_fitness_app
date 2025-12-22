package com.fitness.gateway;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 1) // Run after CORS filter
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public @NonNull Mono filter(@NonNull ServerWebExchange exchange, @NonNull WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        
        // Skip filter for certain paths
        if (shouldSkipFilter(path)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        
        // If no auth header, let security handle it
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found, skipping user sync");
            return chain.filter(exchange);
        }

        return processAuthenticatedRequest(exchange, chain, authHeader);
    }

    private boolean shouldSkipFilter(String path) {
        return path.contains("/actuator") || 
               path.contains("/eureka") ||
               path.equals("/api/users/register");
    }

    private Mono processAuthenticatedRequest(ServerWebExchange exchange, WebFilterChain chain, String authHeader) {
        RegisterRequest userDetails = extractUserDetailsFromToken(authHeader);
        
        if (userDetails == null || userDetails.getKeycloakId() == null) {
            log.warn("Could not extract user details from token");
            return chain.filter(exchange);
        }

        String keycloakId = userDetails.getKeycloakId();

        return userService.validateUser(keycloakId)
            .flatMap(exists -> {
                if (!exists) {
                    log.info("User doesn't exist, registering: {}", userDetails.getEmail());
                    return userService.registerUser(userDetails)
                        .doOnSuccess(user -> log.info("User registered successfully: {}", user.getEmail()))
                        .doOnError(error -> log.error("Error registering user: {}", error.getMessage()))
                        .then(Mono.just(keycloakId));
                } else {
                    log.debug("User already exists: {}", keycloakId);
                    return Mono.just(keycloakId);
                }
            })
            .flatMap(userId -> {
                // Add X-User-ID header to request
                ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header("X-User-ID", userId)
                    .build();
                return chain.filter(exchange.mutate().request(mutatedRequest).build());
            })
            .onErrorResume(error -> {
                log.error("Error in user sync filter: {}", error.getMessage());
                // Continue with original request even if sync fails
                return chain.filter(exchange);
            });
    }

    private @Nullable RegisterRequest extractUserDetailsFromToken(String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest request = new RegisterRequest();
            request.setKeycloakId(claims.getStringClaim("sub"));
            request.setEmail(claims.getStringClaim("email"));
            request.setFirstName(claims.getStringClaim("given_name"));
            request.setLastName(claims.getStringClaim("family_name"));
            request.setPassword("oauth2-user"); // Placeholder for OAuth users

            return request;
        } catch (Exception e) {
            log.error("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }
}