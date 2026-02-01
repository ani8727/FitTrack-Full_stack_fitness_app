package com.fitness.adminservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fitness.adminservice.dto.WorkoutDTO;

@FeignClient(name = "workout-service-client", url = "${WORKOUT_SERVICE_URL}")
public interface WorkoutServiceClient {

    @GetMapping("/workouts")
    List<WorkoutDTO> listWorkouts();

    @GetMapping("/workouts/{id}")
    WorkoutDTO getWorkout(@PathVariable("id") Long id);

    @DeleteMapping("/workouts/{id}")
    void deleteWorkout(@PathVariable("id") Long id);
}
