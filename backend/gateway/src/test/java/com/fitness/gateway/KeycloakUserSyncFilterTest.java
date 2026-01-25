package com.fitness.gateway;

import com.fitness.gateway.user.UserService;
import com.fitness.gateway.filter.KeycloakUserSyncFilter;
import org.junit.jupiter.api.Test;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class KeycloakUserSyncFilterTest {

    @Test
    public void injectsAnonymousForPublicPathWhenNoTokenOrHeader() {
        UserService userService = new UserService(WebClient.builder().build());
        KeycloakUserSyncFilter filter = new KeycloakUserSyncFilter(userService);

        MockServerHttpRequest request = MockServerHttpRequest.get("/api/activities").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        AtomicReference<ServerWebExchange> captured = new AtomicReference<>();
        WebFilterChain chain = ex -> { captured.set(ex); return Mono.empty(); };

        filter.filter(exchange, chain).block();

        ServerWebExchange result = captured.get();
        assertNotNull(result);
        assertEquals("anonymous", result.getRequest().getHeaders().getFirst("X-User-ID"));
    }

    @Test
    public void prefersExistingXUserIdHeader() {
        UserService userService = new UserService(WebClient.builder().build());
        KeycloakUserSyncFilter filter = new KeycloakUserSyncFilter(userService);

        MockServerHttpRequest request = MockServerHttpRequest.get("/api/activities")
                .header("X-User-ID", "existing")
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        AtomicReference<ServerWebExchange> captured = new AtomicReference<>();
        WebFilterChain chain = ex -> { captured.set(ex); return Mono.empty(); };

        filter.filter(exchange, chain).block();

        ServerWebExchange result = captured.get();
        assertNotNull(result);
        assertEquals("existing", result.getRequest().getHeaders().getFirst("X-User-ID"));
    }
}
