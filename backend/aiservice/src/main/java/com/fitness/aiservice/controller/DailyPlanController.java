package com.fitness.aiservice.controller;

import com.fitness.aiservice.model.DailyPlan;
import com.fitness.aiservice.service.DailyPlanService;
// Lombok removed, explicit constructor used
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/")
public class DailyPlanController {
    private final DailyPlanService dailyPlanService;

    public DailyPlanController(DailyPlanService dailyPlanService) {
        this.dailyPlanService = dailyPlanService;
    }

    @PostMapping("/generate/{userId}")
    public Mono<ResponseEntity<DailyPlan>> generateDailyPlan(
            @PathVariable String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate planDate = date != null ? date : LocalDate.now();
        return dailyPlanService.generateDailyPlan(userId, planDate)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DailyPlan>> getUserPlans(
            @PathVariable String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DailyPlan> plans = dailyPlanService.getUserPlans(userId, startDate, endDate);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/user/{userId}/date/{date}")
    public ResponseEntity<DailyPlan> getPlanByDate(
            @PathVariable String userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        DailyPlan plan = dailyPlanService.getOrGeneratePlanByDate(userId, date);
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/user/{userId}/date/{date}")
    public ResponseEntity<DailyPlan> updatePlanByDate(
            @PathVariable String userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody DailyPlan request) {
        DailyPlan updated = dailyPlanService.updatePlan(userId, date, request);
        return ResponseEntity.ok(updated);
    }
}
