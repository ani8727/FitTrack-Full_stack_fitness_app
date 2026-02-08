package com.fittrack.gateway.filters;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 5)
public class JwtForwardingFilter implements GlobalFilter {
    private static final String B64_PREFIX = "b64_";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .flatMap(auth -> {
                    if (auth instanceof JwtAuthenticationToken) {
                        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) auth;
                        var token = jwtAuth.getToken();
                        String userId = token.getSubject();
                        String email = token.getClaimAsString("email");
                        List<String> roles = extractRoles(token);
                        String role = (roles != null && !roles.isEmpty()) ? roles.get(0) : null;

                        // Some upstream proxies are strict about header values; Auth0 subject commonly
                        // contains '|' which can be rejected. Encode to a safe form and let services
                        // decode if needed.
                        String safeUserId = encodeHeaderValue(userId);

                        ServerHttpRequest request = exchange.getRequest().mutate()
                                .header("X-User-ID", safeUserId)
                                .header("X-User-Email", email == null ? "" : email)
                                .header("X-User-Role", role == null ? "" : role)
                                .build();

                        ServerWebExchange mutated = exchange.mutate().request(request).build();
                        return chain.filter(mutated);
                    }
                    return chain.filter(exchange);
                })
                .switchIfEmpty(chain.filter(exchange));
    }

    private static String encodeHeaderValue(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        String b64 = Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
        return B64_PREFIX + b64;
    }

    private static List<String> extractRoles(org.springframework.security.oauth2.jwt.Jwt token) {
        List<String> roles = new ArrayList<>();
        roles.addAll(extractStringListClaim(token, "https://fitness-app/roles"));
        roles.addAll(extractStringListClaim(token, "roles"));
        roles.addAll(extractStringListClaim(token, "fitness_auth/roles"));
        return roles;
    }

    private static List<String> extractStringListClaim(org.springframework.security.oauth2.jwt.Jwt token, String claimName) {
        Object value = token.getClaim(claimName);
        if (value == null) {
            return List.of();
        }

        if (value instanceof String) {
            String s = ((String) value).trim();
            return s.isEmpty() ? List.of() : List.of(s);
        }

        if (value instanceof Collection) {
            Collection<?> collection = (Collection<?>) value;
            List<String> out = new ArrayList<>(collection.size());
            for (Object o : collection) {
                if (o == null) {
                    continue;
                }
                String s = Objects.toString(o, "").trim();
                if (!s.isEmpty()) {
                    out.add(s);
                }
            }
            return out;
        }

        String s = Objects.toString(value, "").trim();
        return s.isEmpty() ? List.of() : List.of(s);
    }
}
