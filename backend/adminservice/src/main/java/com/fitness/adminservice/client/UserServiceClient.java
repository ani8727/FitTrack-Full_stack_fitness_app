package com.fitness.adminservice.client;

import java.util.List;

import com.fitness.adminservice.dto.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public UserServiceClient(RestTemplate restTemplate, @Value("${USER_SERVICE_URL:}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl != null ? baseUrl.replaceAll("/$", "") : "";
    }

    public List<UserDTO> listUsers() {
        ResponseEntity<List<UserDTO>> resp = restTemplate.exchange(
                baseUrl + "/users",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<UserDTO>>() {
                }
        );
        return resp.getBody();
    }

    public UserDTO getUser(Long id) {
        return restTemplate.getForObject(baseUrl + "/users/" + id, UserDTO.class);
    }

    public void deleteUser(Long id) {
        restTemplate.delete(baseUrl + "/users/" + id);
    }

    public void updateUser(Long id, UserDTO user) {
        HttpEntity<UserDTO> entity = new HttpEntity<>(user);
        restTemplate.exchange(baseUrl + "/users/" + id, HttpMethod.PUT, entity, Void.class);
    }

    public List<UserDTO> search(String q) {
        ResponseEntity<List<UserDTO>> resp = restTemplate.exchange(
                baseUrl + "/users/search?q=" + q,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<UserDTO>>() {
                }
        );
        return resp.getBody();
    }
}
