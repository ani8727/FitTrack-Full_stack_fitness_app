package com.fittrack.gateway.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class RouteUriStartupLogger {
    private static final Logger logger = LoggerFactory.getLogger(RouteUriStartupLogger.class);

    private final RouteDefinitionLocator routeDefinitionLocator;

    public RouteUriStartupLogger(RouteDefinitionLocator routeDefinitionLocator) {
        this.routeDefinitionLocator = routeDefinitionLocator;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logRoutes() {
        routeDefinitionLocator.getRouteDefinitions()
                .doOnNext(rd -> logger.info("Gateway route loaded: id={} uri={} predicates={} filters={}",
                        rd.getId(),
                        rd.getUri(),
                        rd.getPredicates(),
                        rd.getFilters()))
                .doOnError(ex -> logger.warn("Failed to enumerate gateway routes: {}", ex.getMessage()))
                .subscribe();
    }
}
