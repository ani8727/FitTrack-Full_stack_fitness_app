package com.fitness.adminservice.client;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
        String url = gatewayUrl + "/user-service/users";
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<List<UserDTO>> resp = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<UserDTO>>() {
                }
        );
        return resp.getBody();
    }

    public UserDTO getUser(Long id) {
        String url = gatewayUrl + "/user-service/users/" + id;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<UserDTO> resp = restTemplate.exchange(url, HttpMethod.GET, entity, UserDTO.class);
        return resp.getBody();
    }

    public void deleteUser(Long id) {
        String url = gatewayUrl + "/user-service/users/" + id;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
    }

    public void updateUser(Long id, UserDTO user) {
        String url = gatewayUrl + "/user-service/users/" + id;
        HttpEntity<UserDTO> entity = new HttpEntity<>(user, buildHeadersWithBearer());
        restTemplate.exchange(url, HttpMethod.PUT, entity, Void.class);
    }

    public List<UserDTO> search(String q) {
        String encoded = URLEncoder.encode(q == null ? "" : q, StandardCharsets.UTF_8);
        String url = gatewayUrl + "/user-service/users/search?q=" + encoded;
        HttpEntity<Void> entity = new HttpEntity<>(buildHeadersWithBearer());
        ResponseEntity<List<UserDTO>> resp = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<UserDTO>>() {
                }
        );
        return resp.getBody();
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
