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
        String url = gatewayUrl + "/activity-service/activities";
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<java.util.List<ActivityDTO>> resp = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<java.util.List<ActivityDTO>>() {
                }
        );
        return resp.getBody();
    }

    public ActivityDTO getActivity(Long id) {
        String url = gatewayUrl + "/activity-service/activities/" + id;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<ActivityDTO> resp = restTemplate.exchange(url, HttpMethod.GET, entity, ActivityDTO.class);
        return resp.getBody();
    }

    public void deleteActivity(Long id) {
        String url = gatewayUrl + "/activity-service/activities/" + id;
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
