package com.fitness.adminservice.client;

import java.time.Instant;
import java.util.List;

import com.fitness.adminservice.dto.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserServiceClient {

    private final RestTemplate restTemplate;
    private final String gatewayUrl;

    public UserServiceClient(RestTemplate restTemplate,
                             @Value("${GATEWAY_URL:https://fittrack-gateway.onrender.com}") String gatewayUrl) {
        this.restTemplate = restTemplate;
        this.gatewayUrl = gatewayUrl != null ? gatewayUrl.replaceAll("/$", "") : "";
    }

    public List<UserDTO> listUsers() {
        // Calls userservice admin endpoint through gateway route: /api/users/** -> /users/**
        String url = gatewayUrl + "/api/users/admin/users";
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<List<java.util.Map<String, Object>>> resp = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<List<java.util.Map<String, Object>>>() {}
        );

        List<java.util.Map<String, Object>> body = resp.getBody();
        if (body == null) return List.of();
        java.util.List<UserDTO> out = new java.util.ArrayList<>(body.size());
        for (java.util.Map<String, Object> row : body) {
            if (row == null) continue;
            UserDTO dto = new UserDTO();
            dto.setId(row.get("id") == null ? null : String.valueOf(row.get("id")));
            dto.setAuth0Id(row.get("auth0Id") == null ? null : String.valueOf(row.get("auth0Id")));
            dto.setEmail(row.get("email") == null ? null : String.valueOf(row.get("email")));

            String name = row.get("name") == null ? null : String.valueOf(row.get("name"));
            if (name != null && !name.isBlank()) {
                String[] parts = name.trim().split("\\s+", 2);
                dto.setFirstName(parts[0]);
                if (parts.length > 1) dto.setLastName(parts[1]);
            }

            String roleRaw = row.get("role") == null ? null : String.valueOf(row.get("role"));
            if (roleRaw != null && roleRaw.toUpperCase().contains("ADMIN")) {
                dto.setRole("ADMIN");
            } else {
                dto.setRole("USER");
            }

            // createdAt may come as ISO string or null; best-effort parse
            Object createdAt = row.get("createdAt");
            if (createdAt instanceof String s) {
                try { dto.setCreatedAt(Instant.parse(s)); } catch (Exception ignored) {}
            }
            out.add(dto);
        }
        return out;
    }

    public UserDTO getUser(Long id) {
        String url = gatewayUrl + "/api/users/admin/users/" + id;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<UserDTO> resp = restTemplate.exchange(url, HttpMethod.GET, entity, UserDTO.class);
        return resp.getBody();
    }

    public void deleteUser(Long id) {
        String url = gatewayUrl + "/api/users/admin/users/" + id;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
    }

    public void updateUser(Long id, UserDTO user) {
        // Not supported by userservice at this time
        throw new UnsupportedOperationException("updateUser not implemented");
    }

    public void updateUserRole(Long id, String role) {
        String url = gatewayUrl + "/api/users/admin/users/" + id + "/role";
        HttpEntity<java.util.Map<String, Object>> entity = new HttpEntity<>(
                java.util.Map.of("role", role),
                buildHeadersWithBearer()
        );
        restTemplate.exchange(url, HttpMethod.PUT, entity, Void.class);
    }

    public void updateUserStatus(Long id, String status, String reason) {
        String url = gatewayUrl + "/api/users/admin/users/" + id + "/status";
        HttpEntity<java.util.Map<String, Object>> entity = new HttpEntity<>(
                java.util.Map.of(
                        "status", status,
                        "reason", reason
                ),
                buildHeadersWithBearer()
        );
        restTemplate.exchange(url, HttpMethod.PUT, entity, Void.class);
    }

    private HttpHeaders buildHeadersWithBearer() {
        HttpHeaders headers = new HttpHeaders();
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken) {
            String token = ((JwtAuthenticationToken) auth).getToken().getTokenValue();
            headers.setBearerAuth(token);
        }
        return headers;
    }
}
