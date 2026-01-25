package com.fitness.gateway.config;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebExceptionHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.gateway.filter.CorrelationIdWebFilter;

import reactor.core.publisher.Mono;

@Component
@Order(-2)
public class GatewayErrorHandler implements WebExceptionHandler {

    private final ObjectMapper objectMapper;

    public GatewayErrorHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    @SuppressWarnings("null")
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        if (ex == null) {
            ex = new IllegalStateException("Unknown error");
        }
        if (exchange.getResponse().isCommitted()) {
            return Mono.error(ex);
        }

        HttpStatus status = resolveStatus(ex);
        if (status == HttpStatus.UNAUTHORIZED) {
            System.out.println("GatewayErrorHandler captured auth error: " + ex.getClass().getName() + " - " + ex.getMessage());
        }
        String message = resolveMessage(ex, status);

        String correlationId = exchange.getAttribute(CorrelationIdWebFilter.ATTRIBUTE_NAME);
        if (correlationId == null) {
            correlationId = exchange.getRequest().getHeaders().getFirst(CorrelationIdWebFilter.HEADER_NAME);
        } else if (correlationId.isBlank()) {
            correlationId = exchange.getRequest().getHeaders().getFirst(CorrelationIdWebFilter.HEADER_NAME);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("path", exchange.getRequest().getPath().value());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("correlationId", correlationId);

        byte[] bytes;
        try {
            bytes = objectMapper.writeValueAsBytes(body);
        } catch (JsonProcessingException jsonError) {
            bytes = ("{\"timestamp\":\"" + Instant.now() + "\",\"status\":" + status.value()
                    + ",\"error\":\"" + status.getReasonPhrase() + "\",\"message\":\"Serialization error\"}")
                    .getBytes();
        }

        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        if (correlationId != null && !correlationId.isBlank()) {
            exchange.getResponse().getHeaders().set(CorrelationIdWebFilter.HEADER_NAME, correlationId);
        }

        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse().bufferFactory().wrap(bytes)));
    }

    private static HttpStatus resolveStatus(Throwable ex) {
        if (ex instanceof ResponseStatusException rse) {
            return HttpStatus.valueOf(rse.getStatusCode().value());
        }
        if (ex instanceof AccessDeniedException) {
            return HttpStatus.FORBIDDEN;
        }
        if (ex instanceof AuthenticationException) {
            return HttpStatus.UNAUTHORIZED;
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private static String resolveMessage(Throwable ex, HttpStatus status) {
        if (ex instanceof ResponseStatusException responseStatusException) {
            String message = responseStatusException.getReason();
            if (message != null) {
                String trimmed = message.trim();
                if (!trimmed.isEmpty()) {
                    return trimmed;
                }
            }
        }
        String message = (ex != null && ex.getMessage() != null) ? ex.getMessage() : "Unknown error";
        if (message != null) {
            String trimmed = message.trim();
            if (!trimmed.isEmpty()) {
                return trimmed;
            }
        }
        return status.getReasonPhrase();
    }
}
