package com.fittrack.gateway.diagnostics;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatusCode;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Component
@Profile("prod")
public class DownstreamWarmupScheduler {
    private static final Logger logger = LoggerFactory.getLogger(DownstreamWarmupScheduler.class);

    private final WebClient webClient;

    @Value("${DOWNSTREAM_WARMUP_ENABLED:true}")
    private boolean warmupEnabled;

    @Value("${USER_SERVICE_URL:https://fittrack-userservice.onrender.com}")
    private String userServiceUrl;

    @Value("${ADMIN_SERVICE_URL:https://fittrack-adminservice.onrender.com}")
    private String adminServiceUrl;

    @Value("${ACTIVITY_SERVICE_URL:https://fittrack-activityservice.onrender.com}")
    private String activityServiceUrl;

    @Value("${AI_SERVICE_URL:https://fittrack-aiservice.onrender.com}")
    private String aiServiceUrl;

    public DownstreamWarmupScheduler(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    // Every 4 minutes by default; keeps free-tier services warm.
    // Use Render env var DOWNSTREAM_WARMUP_ENABLED=false to disable.
    @Scheduled(fixedDelayString = "${DOWNSTREAM_WARMUP_DELAY_MS:240000}")
    public void warmUp() {
        if (!warmupEnabled) {
            return;
        }

        probe("userservice", userServiceUrl);
        probe("adminservice", adminServiceUrl);
        probe("activityservice", activityServiceUrl);
        probe("aiservice", aiServiceUrl);
    }

    private void probe(String name, String baseUrl) {
        if (baseUrl == null || baseUrl.isBlank()) {
            return;
        }

        String url = baseUrl.replaceAll("/+$", "") + "/actuator/health";

        long startNanos = System.nanoTime();
        webClient.get()
            .uri(url)
            .retrieve()
            .toBodilessEntity()
            .timeout(Duration.ofSeconds(15))
            .doOnNext(resp -> {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                HttpStatusCode code = resp.getStatusCode();
                logger.info("Downstream warmup: service={} url={} status={} elapsedMs={} ", name, url, code.value(), elapsedMs);
            })
            .doOnError(ex -> {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                logger.warn("Downstream warmup failed: service={} url={} elapsedMs={} errorType={} error={} ",
                    name,
                    url,
                    elapsedMs,
                    ex.getClass().getName(),
                    ex.getMessage());
            })
            .onErrorResume(ex -> Mono.empty())
            .subscribe();
    }
}
