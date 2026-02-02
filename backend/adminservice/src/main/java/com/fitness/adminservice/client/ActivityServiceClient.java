package com.fitness.adminservice.client;

import java.util.List;

import com.fitness.adminservice.dto.ActivityDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ActivityServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public ActivityServiceClient(RestTemplate restTemplate, @Value("${ACTIVITY_SERVICE_URL:}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl != null ? baseUrl.replaceAll("/$", "") : "";
    }

    public List<ActivityDTO> listActivities() {
        ResponseEntity<List<ActivityDTO>> resp = restTemplate.exchange(
                baseUrl + "/activities",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ActivityDTO>>() {
                }
        );
        return resp.getBody();
    }

    public ActivityDTO getActivity(Long id) {
        return restTemplate.getForObject(baseUrl + "/activities/" + id, ActivityDTO.class);
    }

    public void deleteActivity(Long id) {
        restTemplate.delete(baseUrl + "/activities/" + id);
    }
}
