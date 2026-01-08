package com.fitness.gateway;

import java.util.UUID;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdWebFilter implements WebFilter {

    public static final String HEADER_NAME = "X-Correlation-Id";
    public static final String ATTRIBUTE_NAME = "correlationId";

    @Override
    @SuppressWarnings("null")
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String existingCorrelationId = exchange.getRequest().getHeaders().getFirst(HEADER_NAME);
        final String correlationId = (existingCorrelationId == null || existingCorrelationId.isBlank())
                ? UUID.randomUUID().toString()
                : existingCorrelationId;

        exchange.getAttributes().put(ATTRIBUTE_NAME, correlationId);

        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .headers(headers -> headers.set(HEADER_NAME, correlationId))
                .build();

        exchange.getResponse().getHeaders().set(HEADER_NAME, correlationId);

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }
}
