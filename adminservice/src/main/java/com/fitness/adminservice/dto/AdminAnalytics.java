package com.fitness.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalytics {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long deactivatedUsers;
    private long newUsersToday;
    private long newUsersThisWeek;
    private long newUsersThisMonth;
    private long totalActivities;
    private long activitiesToday;
    private long totalRecommendations;
    private double averageActivitiesPerUser;
    private LocalDateTime lastCalculated;
}
