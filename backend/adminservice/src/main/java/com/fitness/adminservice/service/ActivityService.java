package com.fitness.adminservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitness.adminservice.entity.Activity;
import com.fitness.adminservice.repository.ActivityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    public List<Activity> listAll() {
        return activityRepository.findAll().stream().sorted((a,b)->b.getTimestamp().compareTo(a.getTimestamp())).collect(Collectors.toList());
    }

    public List<Activity> listByUser(Long userId) {
        return activityRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    @Transactional
    public Activity record(Activity activity) {
        return activityRepository.save(activity);
    }
}
