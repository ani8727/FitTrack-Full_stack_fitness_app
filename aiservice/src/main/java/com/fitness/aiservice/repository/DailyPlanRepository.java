package com.fitness.aiservice.repository;

import com.fitness.aiservice.model.DailyPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyPlanRepository extends MongoRepository<DailyPlan, String> {
    Optional<DailyPlan> findByUserIdAndPlanDate(String userId, LocalDate planDate);
    List<DailyPlan> findByUserId(String userId);
    List<DailyPlan> findByUserIdAndPlanDateBetween(String userId, LocalDate startDate, LocalDate endDate);
}
