package com.fittrack.gateway.filters;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import reactor.core.publisher.Mono;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.web.server.ServerWebExchange;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 5)
public class JwtForwardingFilter implements GlobalFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtForwardingFilter.class);

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
                        List<String> roles = token.getClaimAsStringList("roles");
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
}
