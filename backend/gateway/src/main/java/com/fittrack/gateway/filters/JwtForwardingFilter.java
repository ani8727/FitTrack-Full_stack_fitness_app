package com.fittrack.gateway.filters;

import java.util.List;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import reactor.core.publisher.Mono;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.web.server.ServerWebExchange;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 5)
public class JwtForwardingFilter implements GlobalFilter {
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

                        ServerHttpRequest request = exchange.getRequest().mutate()
                                .header("X-User-Id", userId == null ? "" : userId)
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
