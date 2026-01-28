package com.fittrack.gateway.config;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class PreflightCorsFilter implements WebFilter {

    private static final String ALLOWED_ORIGIN = "https://fittrack-nine-phi.vercel.app";
    private static final String ALLOWED_METHODS = "GET,POST,PUT,DELETE,OPTIONS";
    private static final String ALLOWED_HEADERS = "Authorization,Content-Type,X-Requested-With,X-User-ID,Accept";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
            HttpHeaders headers = exchange.getResponse().getHeaders();
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED_ORIGIN);
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, ALLOWED_METHODS);
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, ALLOWED_HEADERS);
            headers.add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");
            headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization");
            exchange.getResponse().setStatusCode(HttpStatus.OK);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }
}
