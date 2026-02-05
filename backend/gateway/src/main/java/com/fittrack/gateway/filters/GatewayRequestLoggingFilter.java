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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
@Order(Ordered.LOWEST_PRECEDENCE - 10)
public class GatewayRequestLoggingFilter implements GlobalFilter {
    private static final Logger logger = LoggerFactory.getLogger(GatewayRequestLoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startNanos = System.nanoTime();

        String method = exchange.getRequest().getMethod() == null ? "?" : exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getURI().getRawPath();

        return chain.filter(exchange)
            .onErrorResume(ex -> {
                String routeId = resolveRouteId(exchange);
                String targetUrl = resolveTargetUrl(exchange);
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;

                logger.warn(
                    "Gateway proxy failed: method={} path={} routeId={} targetUrl={} elapsedMs={} errorType={} error={} ",
                    method,
                    path,
                    routeId,
                    targetUrl,
                    elapsedMs,
                    ex.getClass().getName(),
                    ex.getMessage(),
                    ex);

                // Help debugging from browser without leaking details in the body.
                // Only set headers if the response isn't committed.
                if (!exchange.getResponse().isCommitted()) {
                    exchange.getResponse().setStatusCode(HttpStatus.BAD_GATEWAY);
                    exchange.getResponse().getHeaders().set("X-Gateway-Error", ex.getClass().getSimpleName());
                }

                return exchange.getResponse().setComplete();
            })
            .doFinally(signalType -> {
                String routeId = resolveRouteId(exchange);
                String targetUrl = resolveTargetUrl(exchange);
                HttpStatusCode status = exchange.getResponse().getStatusCode();
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                logger.info("Gateway request: method={} path={} routeId={} targetUrl={} status={} elapsedMs={} signal={} ",
                    method,
                    path,
                    routeId,
                    targetUrl,
                    status == null ? "?" : status.value(),
                    elapsedMs,
                    signalType);
            });
    }

    private static String resolveRouteId(ServerWebExchange exchange) {
        Route route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
        return route == null ? "-" : route.getId();
    }

    private static String resolveTargetUrl(ServerWebExchange exchange) {
        Object uri = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR);
        return uri == null ? "-" : uri.toString();
    }
}
