package com.fitness.adminservice.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fitness.adminservice.client.ActivityServiceClient;
import com.fitness.adminservice.client.UserServiceClient;
import com.fitness.adminservice.client.WorkoutServiceClient;
import com.fitness.adminservice.dto.ActivityDTO;
import com.fitness.adminservice.dto.UserDTO;
import com.fitness.adminservice.dto.WorkoutDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminFacadeService {

    private final UserServiceClient userClient;
    private final ActivityServiceClient activityClient;
    private final WorkoutServiceClient workoutClient;

    public List<UserDTO> listUsers() {
        return userClient.listUsers();
    }

    public void deleteUser(Long id) {
        userClient.deleteUser(id);
    }

    public List<ActivityDTO> listActivities() {
        return activityClient.listActivities();
    }

    public void deleteActivity(Long id) {
        activityClient.deleteActivity(id);
    }

    public List<WorkoutDTO> listWorkouts() {
        return workoutClient.listWorkouts();
    }

    public void deleteWorkout(Long id) {
        workoutClient.deleteWorkout(id);
    }

    public Map<String, Object> stats() {
        List<UserDTO> users = listUsers();
        List<ActivityDTO> activities = listActivities();
        List<WorkoutDTO> workouts = listWorkouts();
        return Map.of(
            "totalUsers", users == null ? 0 : users.size(),
            "totalActivities", activities == null ? 0 : activities.size(),
            "totalWorkouts", workouts == null ? 0 : workouts.size()
        );
    }
}
