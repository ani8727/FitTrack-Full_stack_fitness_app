package com.fittrack.gateway.diagnostics;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

@RestController
@Profile("prod")
@RequestMapping(path = "/public/probe", produces = MediaType.APPLICATION_JSON_VALUE)
public class DownstreamProbeController {
    private static final int[] RETRYABLE_STATUS_CODES = new int[] { 502, 503, 504 };

    private final WebClient webClient = WebClient.builder().build();

    @Value("${USER_SERVICE_URL:https://fittrack-userservice.onrender.com}")
    private String userServiceUrl;

    @Value("${ADMIN_SERVICE_URL:https://fittrack-adminservice.onrender.com}")
    private String adminServiceUrl;

    @Value("${ACTIVITY_SERVICE_URL:https://fittrack-activityservice.onrender.com}")
    private String activityServiceUrl;

    @Value("${AI_SERVICE_URL:https://fittrack-aiservice.onrender.com}")
    private String aiServiceUrl;

    @Value("${DOWNSTREAM_PROBE_TIMEOUT_MS:7000}")
    private long probeTimeoutMs;

    @Value("${DOWNSTREAM_PROBE_RETRIES:2}")
    private int probeRetries;

    @Value("${DOWNSTREAM_PROBE_FIRST_BACKOFF_MS:250}")
    private long probeFirstBackoffMs;

    @Value("${DOWNSTREAM_PROBE_MAX_BACKOFF_MS:1500}")
    private long probeMaxBackoffMs;

    @Value("${DOWNSTREAM_PROBE_RETRY_JITTER:0.3}")
    private double probeRetryJitter;

    @GetMapping
    public Mono<Map<String, Object>> probeAll() {
        Mono<Map<String, Object>> users = probe("userservice", userServiceUrl);
        Mono<Map<String, Object>> admin = probe("adminservice", adminServiceUrl);
        Mono<Map<String, Object>> activity = probe("activityservice", activityServiceUrl);
        Mono<Map<String, Object>> ai = probe("aiservice", aiServiceUrl);

        return Mono.zip(users, admin, activity, ai)
            .map(tuple -> {
                Map<String, Object> out = new LinkedHashMap<>();
                out.put("userservice", tuple.getT1());
                out.put("adminservice", tuple.getT2());
                out.put("activityservice", tuple.getT3());
                out.put("aiservice", tuple.getT4());
                return out;
            });
    }

    private Mono<Map<String, Object>> probe(String name, String baseUrl) {
        String url = (baseUrl == null ? "" : baseUrl).replaceAll("/+$", "") + "/actuator/health";
        long startNanos = System.nanoTime();
        AtomicInteger attempts = new AtomicInteger(0);

        Duration timeout = Duration.ofMillis(Math.max(1000, probeTimeoutMs));
        Duration firstBackoff = Duration.ofMillis(Math.max(0, probeFirstBackoffMs));
        Duration maxBackoff = Duration.ofMillis(Math.max(firstBackoff.toMillis(), probeMaxBackoffMs));

        Mono<Integer> attempt = Mono.defer(() -> {
            attempts.incrementAndGet();
            return webClient.get()
                .uri(url)
                .header("Cache-Control", "no-cache")
                .header("User-Agent", "fittrack-gateway-probe")
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
                Retry.backoff(Math.max(0, probeRetries), firstBackoff)
                    .maxBackoff(maxBackoff)
                    .jitter(Math.min(1.0, Math.max(0.0, probeRetryJitter)))
                    .filter(this::isRetryableFailure)
                    // Throw the last failure so the JSON error is meaningful.
                    .onRetryExhaustedThrow((spec, signal) -> signal.failure())
            )
            .map(status -> {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                Map<String, Object> out = new LinkedHashMap<>();
                out.put("name", name);
                out.put("url", url);
                out.put("status", status);
                out.put("attempts", attempts.get());
                out.put("elapsedMs", elapsedMs);
                return out;
            })
            .onErrorResume(ex -> {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                Map<String, Object> out = new LinkedHashMap<>();
                out.put("name", name);
                out.put("url", url);
                out.put("status", "ERROR");
                out.put("attempts", attempts.get());
                out.put("elapsedMs", elapsedMs);
                out.put("errorType", ex.getClass().getName());
                out.put("error", ex.getMessage());
                return Mono.just(out);
            });
    }

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

        @SuppressWarnings("unused")
        public int getStatus() {
            return status;
        }

        @SuppressWarnings("unused")
        public String getUrl() {
            return url;
        }
    }
}
