package com.fittrack.gateway.diagnostics;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@RestController
@Profile("prod")
@RequestMapping(path = "/public/probe", produces = MediaType.APPLICATION_JSON_VALUE)
public class DownstreamProbeController {
    private final WebClient webClient = WebClient.builder().build();

    @Value("${USER_SERVICE_URL:https://fittrack-userservice.onrender.com}")
    private String userServiceUrl;

    @Value("${ADMIN_SERVICE_URL:https://fittrack-adminservice.onrender.com}")
    private String adminServiceUrl;

    @Value("${ACTIVITY_SERVICE_URL:https://fittrack-activityservice.onrender.com}")
    private String activityServiceUrl;

    @Value("${AI_SERVICE_URL:https://fittrack-aiservice.onrender.com}")
    private String aiServiceUrl;

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

        return webClient.get()
            .uri(url)
            .exchangeToMono(resp -> {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                Map<String, Object> out = new LinkedHashMap<>();
                out.put("name", name);
                out.put("url", url);
                out.put("status", resp.statusCode().value());
                out.put("elapsedMs", elapsedMs);
                return Mono.just(out);
            })
            .timeout(Duration.ofSeconds(15))
            .onErrorResume(ex -> {
                long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
                Map<String, Object> out = new LinkedHashMap<>();
                out.put("name", name);
                out.put("url", url);
                out.put("status", "ERROR");
                out.put("elapsedMs", elapsedMs);
                out.put("errorType", ex.getClass().getName());
                out.put("error", ex.getMessage());
                return Mono.just(out);
            });
    }
}
