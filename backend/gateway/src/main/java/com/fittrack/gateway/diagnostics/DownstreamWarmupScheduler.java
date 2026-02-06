package com.fittrack.gateway.diagnostics;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatusCode;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

@Component
@Profile("prod")
public class DownstreamWarmupScheduler {
    private static final Logger logger = LoggerFactory.getLogger(DownstreamWarmupScheduler.class);

    private static final int[] RETRYABLE_STATUS_CODES = new int[] { 502, 503, 504 };

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

    @Value("${DOWNSTREAM_WARMUP_TIMEOUT_MS:30000}")
    private long warmupTimeoutMs;

    @Value("${DOWNSTREAM_WARMUP_RETRIES:10}")
    private int warmupRetries;

    @Value("${DOWNSTREAM_WARMUP_FIRST_BACKOFF_MS:500}")
    private long warmupFirstBackoffMs;

    @Value("${DOWNSTREAM_WARMUP_MAX_BACKOFF_MS:15000}")
    private long warmupMaxBackoffMs;

    @Value("${DOWNSTREAM_WARMUP_RETRY_JITTER:0.5}")
    private double warmupRetryJitter;

    @Value("${DOWNSTREAM_WARMUP_SERIAL:true}")
    private boolean warmupSerial;

    @Value("${DOWNSTREAM_WARMUP_BETWEEN_DELAY_MS:500}")
    private long warmupBetweenDelayMs;

    public DownstreamWarmupScheduler() {
        // Use a dedicated client so we don't accidentally inherit load-balancer filters.
        this.webClient = WebClient.builder().build();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void warmUpOnStartup() {
        if (!warmupEnabled) {
            return;
        }

        // Fire once right after startup so the logs clearly show whether
        // the gateway can reach each downstream service.
        warmUp();
    }

    // Every 4 minutes by default; keeps free-tier services warm.
    // Use Render env var DOWNSTREAM_WARMUP_ENABLED=false to disable.
    @Scheduled(
        initialDelayString = "${DOWNSTREAM_WARMUP_INITIAL_DELAY_MS:60000}",
        fixedDelayString = "${DOWNSTREAM_WARMUP_DELAY_MS:240000}"
    )
    public void warmUp() {
        if (!warmupEnabled) {
            return;
        }

        List<ServiceTarget> targets = List.of(
            new ServiceTarget("userservice", userServiceUrl),
            new ServiceTarget("adminservice", adminServiceUrl),
            new ServiceTarget("activityservice", activityServiceUrl),
            new ServiceTarget("aiservice", aiServiceUrl)
        );

        Duration between = Duration.ofMillis(Math.max(0, warmupBetweenDelayMs));

        Mono<Void> run = (warmupSerial ? Flux.fromIterable(targets).concatMap(t -> probeMono(t.name(), t.baseUrl()).delayElement(between))
            : Flux.fromIterable(targets).flatMap(t -> probeMono(t.name(), t.baseUrl())))
            .then();

        run.subscribe();
    }

    private Mono<Void> probeMono(String name, String baseUrl) {
        if (baseUrl == null || baseUrl.isBlank()) {
            return Mono.empty();
        }

        String url = baseUrl.replaceAll("/+$", "") + "/actuator/health";

        Duration timeout = Duration.ofMillis(Math.max(1000, warmupTimeoutMs));
        Duration firstBackoff = Duration.ofMillis(Math.max(0, warmupFirstBackoffMs));
        Duration maxBackoff = Duration.ofMillis(Math.max(firstBackoff.toMillis(), warmupMaxBackoffMs));

        long startNanos = System.nanoTime();
        Instant startedAt = Instant.now();
        AtomicInteger attempts = new AtomicInteger(0);

        Mono<Integer> attempt = Mono.defer(() -> {
            attempts.incrementAndGet();
            return webClient.get()
                .uri(url)
                .header("Cache-Control", "no-cache")
                .header("User-Agent", "fittrack-gateway-warmup")
                .exchangeToMono(resp -> {
                    int status = resp.statusCode().value();
                    if (isRetryableStatus(status)) {
                        return resp.releaseBody().then(Mono.error(new RetryableStatusException(status, url)));
                    }

                    return resp.releaseBody().thenReturn(status);
                })
                .timeout(timeout);
        });

        return attempt
            .retryWhen(
                Retry.backoff(Math.max(0, warmupRetries), firstBackoff)
                    .maxBackoff(maxBackoff)
                    .jitter(Math.min(1.0, Math.max(0.0, warmupRetryJitter)))
                    .filter(this::isRetryableFailure)
                    .doBeforeRetry(signal -> {
                        Throwable failure = signal.failure();
                        String failureType = (failure == null) ? "<null>" : failure.getClass().getName();
                        String failureMsg = (failure == null) ? "<null>" : failure.getMessage();
                        logger.info(
                            "Downstream warmup retrying: service={} url={} retry={} errorType={} error={} ",
                            name,
                            url,
                            signal.totalRetries() + 1,
                            failureType,
                            failureMsg
                        );
                    })
                    // Throw the last failure so logs show the real cause (timeout, 502, DNS, etc).
                    .onRetryExhaustedThrow((spec, signal) -> signal.failure())
            )
            .doOnNext(status -> {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                HttpStatusCode code = HttpStatusCode.valueOf(status);
                if (status == 200) {
                    logger.info(
                        "Downstream warmup: service={} url={} status={} attempts={} elapsedMs={} startedAt={} ",
                        name,
                        url,
                        code.value(),
                        attempts.get(),
                        elapsedMs,
                        startedAt
                    );
                } else {
                    logger.warn(
                        "Downstream warmup non-200: service={} url={} status={} attempts={} elapsedMs={} startedAt={} ",
                        name,
                        url,
                        code.value(),
                        attempts.get(),
                        elapsedMs,
                        startedAt
                    );
                }
            })
            .doOnError(ex -> {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                String failureType = ex.getClass().getName();
                String failureMsg = ex.getMessage();
                if (ex instanceof RetryableStatusException rse) {
                    failureType = ex.getClass().getName() + "(status=" + rse.getStatus() + ")";
                    failureMsg = rse.getMessage();
                }
                logger.warn(
                    "Downstream warmup failed: service={} url={} attempts={} elapsedMs={} errorType={} error={} ",
                    name,
                    url,
                    attempts.get(),
                    elapsedMs,
                    failureType,
                    failureMsg
                );
            })
            .onErrorResume(ex -> Mono.empty())
            .then();
    }

    private record ServiceTarget(String name, String baseUrl) {}

    private boolean isRetryableStatus(int status) {
        for (int code : RETRYABLE_STATUS_CODES) {
            if (code == status) {
                return true;
            }
        }
        return false;
    }

    private boolean isRetryableFailure(Throwable ex) {
        if (ex instanceof RetryableStatusException) {
            return true;
        }
        if (ex instanceof TimeoutException) {
            return true;
        }
        if (ex instanceof WebClientRequestException) {
            return true;
        }
        if (ex instanceof WebClientResponseException wcre) {
            return isRetryableStatus(wcre.getStatusCode().value());
        }
        return false;
    }

    private static final class RetryableStatusException extends RuntimeException {
        private final int status;
        private final String url;

        private RetryableStatusException(int status, String url) {
            super("Retryable status=" + status + " from " + url);
            this.status = status;
            this.url = url;
        }

        public int getStatus() {
            return status;
        }

        public String getUrl() {
            return url;
        }
    }
}
