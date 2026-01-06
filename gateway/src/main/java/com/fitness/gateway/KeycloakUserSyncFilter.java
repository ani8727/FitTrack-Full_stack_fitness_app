package com.fitness.gateway;

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

    @Override
    @SuppressWarnings("null")
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        RegisterRequest registerRequest = getUserDetails(token);

        // Determine final user id: prefer header, then token-sub, otherwise null
        final String tokenSub = (registerRequest != null ? registerRequest.getKeycloakId() : null);
        final String finalUserIdCandidate = userId != null ? userId : tokenSub;

        // Public paths where missing X-User-ID should be injected as "anonymous"
        String path = exchange.getRequest().getPath().pathWithinApplication().value();
        boolean isPublicPath = path != null && (
                path.startsWith("/api/activities") ||
                path.startsWith("/api/users/register") ||
                path.startsWith("/api/contact")
        );

        final String finalUserId = finalUserIdCandidate != null ? finalUserIdCandidate : (isPublicPath ? "anonymous" : null);

        if (registerRequest != null) {
            // Validate and auto-register user when we have token details
            String uid = finalUserId != null ? finalUserId : tokenSub;
            return userService.validateUser(uid)
                    .flatMap(exist -> {
                        if (!exist) {
                            log.info("User not found, auto-registering: {}", uid);
                            return userService.registerUser(registerRequest)
                                    .doOnSuccess(u -> log.info("User registered successfully: {}", uid))
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
            log.debug("Injected X-User-ID='{}' for path {}", finalUserId, path);
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
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setPassword("dummy@123123");
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));
            log.info("Extracted user details - sub: {}, email: {}", registerRequest.getKeycloakId(), registerRequest.getEmail());
            return registerRequest;
        } catch (Exception e) {
            log.error("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }
}