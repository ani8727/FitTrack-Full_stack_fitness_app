package com.fittrack.gateway.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class GatewayRequestLoggingFilter implements GlobalFilter {
    private static final Logger logger = LoggerFactory.getLogger(GatewayRequestLoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startNanos = System.nanoTime();

        String method = exchange.getRequest().getMethod() == null ? "?" : exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getURI().getRawPath();

        return chain.filter(exchange)
                .doOnError(ex -> {
                    String routeId = resolveRouteId(exchange);
                    long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                    logger.warn("Gateway request failed: method={} path={} routeId={} elapsedMs={} errorType={} error={} ",
                            method,
                            path,
                            routeId,
                            elapsedMs,
                            ex.getClass().getSimpleName(),
                            ex.getMessage());
                })
                .doFinally(signalType -> {
                    String routeId = resolveRouteId(exchange);
                    HttpStatusCode status = exchange.getResponse().getStatusCode();
                    long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                    logger.info("Gateway request: method={} path={} routeId={} status={} elapsedMs={} signal={} ",
                            method,
                            path,
                            routeId,
                            status == null ? "?" : status.value(),
                            elapsedMs,
                            signalType);
                });
    }

    private static String resolveRouteId(ServerWebExchange exchange) {
        Route route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
        return route == null ? "-" : route.getId();
    }
}
