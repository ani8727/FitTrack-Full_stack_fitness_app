package com.fitness.adminservice.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fitness.adminservice.client.ActivityServiceClient;
import com.fitness.adminservice.client.UserServiceClient;
import com.fitness.adminservice.dto.ActivityDTO;
import com.fitness.adminservice.dto.UserDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminFacadeService {

    private final UserServiceClient userClient;
    private final ActivityServiceClient activityClient;

    public List<UserDTO> listUsers() {
        return userClient.listUsers();
    }

    public UserDTO getUser(Long id) {
        return userClient.getUser(id);
    }

    public void deleteUser(Long id) {
        userClient.deleteUser(id);
    }

    public void updateUser(Long id, UserDTO user) {
        userClient.updateUser(id, user);
    }

    public List<ActivityDTO> listActivities() {
        return activityClient.listActivities();
    }

    public void deleteActivity(Long id) {
        activityClient.deleteActivity(id);
    }

    public Map<String, Object> stats() {
        List<UserDTO> users = listUsers();
        List<ActivityDTO> activities = listActivities();
        return Map.of(
            "totalUsers", users == null ? 0 : users.size(),
            "totalActivities", activities == null ? 0 : activities.size()
        );
    }
}
