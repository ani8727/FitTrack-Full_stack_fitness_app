package com.fitness.adminservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fitness.adminservice.dto.ActivityDTO;

@FeignClient(name = "activity-service-client", url = "${ACTIVITY_SERVICE_URL}")
public interface ActivityServiceClient {

    @GetMapping("/activities")
    List<ActivityDTO> listActivities();

    @GetMapping("/activities/{id}")
    ActivityDTO getActivity(@PathVariable("id") Long id);

    @DeleteMapping("/activities/{id}")
    void deleteActivity(@PathVariable("id") Long id);
}
