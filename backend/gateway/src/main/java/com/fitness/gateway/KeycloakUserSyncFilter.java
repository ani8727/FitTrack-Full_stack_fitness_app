package com.fitness.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.server.reactive.ServerHttpRequest;
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
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;
    
    @Value("${user-sync.default-password:#{T(java.util.UUID).randomUUID().toString()}}")
    private String defaultPassword;

    @Override
    @SuppressWarnings("null")
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().pathWithinApplication().value();
        
        // Allow internal service-to-service calls (from other microservices) to bypass auth
        String internalServiceId = exchange.getRequest().getHeaders().getFirst("X-Service-ID");
        if (internalServiceId != null) {
            // Internal call - bypass auth filter, continue with chain
            return chain.filter(exchange);
        }
        
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        RegisterRequest registerRequest = getUserDetails(token);

        // Determine final user id: prefer header, then token-sub, otherwise null
        final String tokenSub = (registerRequest != null ? registerRequest.getKeycloakId() : null);
        final String finalUserIdCandidate = userId != null ? userId : tokenSub;

        // Public paths where missing X-User-ID should be injected as "anonymous"
        boolean isPublicPath = path != null && (
            path.startsWith("/api/activities") ||
            path.startsWith("/api/users/register") ||
            path.startsWith("/api/contact") ||
            path.startsWith("/api/recommendations")
        );

        final String finalUserId = finalUserIdCandidate != null ? finalUserIdCandidate : (isPublicPath ? "anonymous" : null);

        if (registerRequest != null) {
            // Validate and auto-register user when we have token details
            String uid = finalUserId != null ? finalUserId : tokenSub;
            return userService.validateUser(uid)
                    .flatMap(exist -> {
                        if (!exist) {
                            log.debug("Auto-registering user");
                            return userService.registerUser(registerRequest)
                                    .then(Mono.empty());
                        }
                        return Mono.empty();
                    })
                    .onErrorResume(error -> {
                        log.error("Error during user sync, continuing anyway: {}", error.getMessage());
                        return Mono.empty();
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", uid)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }

        // No token and no user header: if public path, inject anonymous; otherwise continue unchanged
        if (finalUserId != null) {
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header("X-User-ID", finalUserId)
                    .build();
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        }

        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                log.warn("Invalid or missing token");
                return null;
            }
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            String sub = claims.getStringClaim("sub");
            String email = claims.getStringClaim("email");
            String given = claims.getStringClaim("given_name");
            String family = claims.getStringClaim("family_name");

            // Fallbacks so auto-registration never fails on missing token claims
            registerRequest.setKeycloakId(sub);
            registerRequest.setEmail(email != null ? email : sub + "@auth.local");
            registerRequest.setPassword(defaultPassword);
            registerRequest.setFirstName(given != null ? given : "Fitness");
            registerRequest.setLastName(family != null ? family : "User");

            log.debug("Extracted user details from JWT token");
            return registerRequest;
        } catch (Exception e) {
            log.error("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }
}