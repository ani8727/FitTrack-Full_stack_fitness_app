package com.fitness.adminservice.client;

import com.fitness.adminservice.dto.ActivityDTO;
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
@SuppressWarnings("null")
public class ActivityServiceClient {

    private final RestTemplate restTemplate;
    private final String gatewayUrl;

    public ActivityServiceClient(RestTemplate restTemplate, @Value("${GATEWAY_URL:https://fittrack-gateway.onrender.com}") String gatewayUrl) {
        this.restTemplate = restTemplate;
        this.gatewayUrl = gatewayUrl != null ? gatewayUrl.replaceAll("/$", "") : "";
    }

    public java.util.List<ActivityDTO> listActivities() {
        // Calls activityservice admin endpoint through gateway route: /api/activities/** -> /activities/**
        String url = gatewayUrl + "/api/activities/admin/activities";
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<java.util.List<java.util.Map<String, Object>>> resp = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<java.util.List<java.util.Map<String, Object>>>() {}
        );

        java.util.List<java.util.Map<String, Object>> body = resp.getBody();
        if (body == null) return java.util.List.of();

        java.util.List<ActivityDTO> out = new java.util.ArrayList<>(body.size());
        for (java.util.Map<String, Object> row : body) {
            if (row == null) continue;
            ActivityDTO dto = new ActivityDTO();
            dto.setId(row.get("id") == null ? null : String.valueOf(row.get("id")));
            dto.setUserId(row.get("userId") == null ? null : String.valueOf(row.get("userId")));
            dto.setType(row.get("type") == null ? null : String.valueOf(row.get("type")));
            dto.setDuration(row.get("duration") instanceof Number n ? n.intValue() : null);
            dto.setCaloriesBurned(row.get("caloriesBurned") instanceof Number n ? n.intValue() : null);
            // createdAt may deserialize as String; leave null if not directly mapped.
            out.add(dto);
        }
        return out;
    }

    public ActivityDTO getActivity(String id) {
        String url = gatewayUrl + "/api/activities/" + id;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<ActivityDTO> resp = restTemplate.exchange(url, HttpMethod.GET, entity, ActivityDTO.class);
        return resp.getBody();
    }

    public void deleteActivity(String id) {
        String url = gatewayUrl + "/api/activities/admin/activities/" + id;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
    }

    private HttpHeaders buildHeadersWithBearer() {
        HttpHeaders headers = new HttpHeaders();
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            String token = jwtAuth.getToken().getTokenValue();
            headers.setBearerAuth(token);
        }
        return headers;
    }
}
