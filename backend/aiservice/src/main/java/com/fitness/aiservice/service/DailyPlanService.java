package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.UserProfile;
import com.fitness.aiservice.model.DailyPlan;
import com.fitness.aiservice.repository.DailyPlanRepository;
// Lombok annotations not required for constructor or logging
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DailyPlanService {
    private final DailyPlanRepository dailyPlanRepository;
    private final GeminiService geminiService;
    private final WebClient apiGatewayWebClient;
    private final ObjectMapper mapper;

    public DailyPlanService(DailyPlanRepository dailyPlanRepository, GeminiService geminiService, WebClient apiGatewayWebClient) {
        this.dailyPlanRepository = dailyPlanRepository;
        this.geminiService = geminiService;
        this.apiGatewayWebClient = apiGatewayWebClient;
        this.mapper = new ObjectMapper();
    }

    private void logError(String message, Throwable e) {
        System.err.println(message + (e != null ? (": " + e.getMessage()) : ""));
    }

    @SuppressWarnings("null")
    public Mono<DailyPlan> generateDailyPlan(String userId, LocalDate planDate) {
        // Check if plan already exists
        Optional<DailyPlan> existingPlan = dailyPlanRepository.findByUserIdAndPlanDate(userId, planDate);
        if (existingPlan.isPresent()) {
            return Mono.just(existingPlan.get());
        }

        // Fetch user profile from user service
        return fetchUserProfile(userId)
            .publishOn(Schedulers.boundedElastic())
                .flatMap(userProfile -> {
                    String prompt = createDailyPlanPrompt(userProfile, planDate);
                    return geminiService.getAnswer(prompt)
                            .map(aiResponse -> processDailyPlanResponse(userId, planDate, aiResponse, userProfile))
                            .doOnNext(plan -> {
                                if (plan != null) {
                                    dailyPlanRepository.save(plan);
                                    // log.debug("Daily plan saved for user: {}", userId);
                                    System.out.println("Daily plan saved for user: " + userId);
                                }
                            })
                            .onErrorReturn(createDefaultDailyPlan(userId, planDate, userProfile));
                })
                .onErrorReturn(createDefaultDailyPlan(userId, planDate, null));
    }

    private Mono<UserProfile> fetchUserProfile(String userId) {
        return apiGatewayWebClient.get()
            .uri("/api/users/{userId}", userId)
                .header("X-Service-ID", "ai-service")
                .retrieve()
                .bodyToMono(UserProfile.class)
                .doOnError(e -> logError("Error fetching user profile", e));
    }

    private DailyPlan processDailyPlanResponse(String userId, LocalDate planDate, String aiResponse, UserProfile userProfile) {
        try {
            JsonNode rootNode = mapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            JsonNode planJson = mapper.readTree(jsonContent);

            List<DailyPlan.WorkoutPlan> workouts = new ArrayList<>();
            JsonNode workoutsNode = planJson.path("workouts");
            if (workoutsNode.isArray()) {
                workoutsNode.forEach(workoutNode -> {
                    List<String> exercises = new ArrayList<>();
                    JsonNode exercisesNode = workoutNode.path("exercises");
                    if (exercisesNode.isArray()) {
                        exercisesNode.forEach(ex -> exercises.add(ex.asText()));
                    }

                    DailyPlan.WorkoutPlan workout = new DailyPlan.WorkoutPlan();
                    workout.setTime(workoutNode.path("time").asText());
                    workout.setType(workoutNode.path("type").asText());
                    workout.setDuration(workoutNode.path("duration").asInt());
                    workout.setIntensity(workoutNode.path("intensity").asText());
                    workout.setDescription(workoutNode.path("description").asText());
                    workout.setExercises(exercises);
                    workouts.add(workout);
                });
            }

            List<String> goals = new ArrayList<>();
            JsonNode goalsNode = planJson.path("goals");
            if (goalsNode.isArray()) {
                goalsNode.forEach(goal -> goals.add(goal.asText()));
            }

            DailyPlan plan = new DailyPlan();
            plan.setUserId(userId);
            plan.setPlanDate(planDate);
            plan.setMorningRoutine(planJson.path("morningRoutine").asText());
            plan.setWorkouts(workouts);
            plan.setNutritionAdvice(planJson.path("nutritionAdvice").asText());
            plan.setHydrationReminder(planJson.path("hydrationReminder").asText());
            plan.setGoals(goals);
            plan.setMotivationalQuote(planJson.path("motivationalQuote").asText());
            plan.setTargetSteps(planJson.path("targetSteps").asInt());
            plan.setTargetCalories(planJson.path("targetCalories").asInt());
            plan.setRestAndRecovery(planJson.path("restAndRecovery").asText());
            plan.setCreatedAt(LocalDateTime.now());
            return plan;

        } catch (Exception e) {
            logError("Error processing daily plan response", e);
            return createDefaultDailyPlan(userId, planDate, userProfile);
        }
    }

    private DailyPlan createDefaultDailyPlan(String userId, LocalDate planDate, UserProfile userProfile) {
        List<DailyPlan.WorkoutPlan> defaultWorkouts = new ArrayList<>();
        
        DailyPlan.WorkoutPlan workout1 = new DailyPlan.WorkoutPlan();
        workout1.setTime("Morning");
        workout1.setType("Cardio");
        workout1.setDuration(30);
        workout1.setIntensity("Moderate");
        workout1.setDescription("Start your day with light cardio");
        workout1.setExercises(Arrays.asList("Brisk walking", "Light jogging", "Cycling"));
        defaultWorkouts.add(workout1);
        
        DailyPlan.WorkoutPlan workout2 = new DailyPlan.WorkoutPlan();
        workout2.setTime("Evening");
        workout2.setType("Strength");
        workout2.setDuration(20);
        workout2.setIntensity("Light");
        workout2.setDescription("Light strength training");
        workout2.setExercises(Arrays.asList("Bodyweight squats", "Push-ups", "Plank"));
        defaultWorkouts.add(workout2);

        DailyPlan plan = new DailyPlan();
        plan.setUserId(userId);
        plan.setPlanDate(planDate);
        plan.setMorningRoutine("Start with hydration, light stretching, and a healthy breakfast");
        plan.setWorkouts(defaultWorkouts);
        plan.setNutritionAdvice("Eat balanced meals with protein, healthy fats, and complex carbs");
        plan.setHydrationReminder("Drink at least 8 glasses of water throughout the day");
        plan.setGoals(Arrays.asList("Stay active", "Eat healthy", "Get adequate rest"));
        plan.setMotivationalQuote("Every workout brings you closer to your goals!");
        plan.setTargetSteps(8000);
        plan.setTargetCalories(2000);
        plan.setRestAndRecovery("Ensure 7-8 hours of quality sleep");
        plan.setCreatedAt(LocalDateTime.now());
        return plan;
    }

    private String createDailyPlanPrompt(UserProfile userProfile, LocalDate planDate) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Create a personalized daily fitness plan in the following EXACT JSON format:\n");
        prompt.append("{\n");
        prompt.append("  \"morningRoutine\": \"Morning routine description\",\n");
        prompt.append("  \"workouts\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"time\": \"Morning/Afternoon/Evening\",\n");
        prompt.append("      \"type\": \"Cardio/Strength/Flexibility/Sports\",\n");
        prompt.append("      \"duration\": 30,\n");
        prompt.append("      \"intensity\": \"Low/Moderate/High\",\n");
        prompt.append("      \"description\": \"Workout description\",\n");
        prompt.append("      \"exercises\": [\"Exercise 1\", \"Exercise 2\"]\n");
        prompt.append("    }\n");
        prompt.append("  ],\n");
        prompt.append("  \"nutritionAdvice\": \"Nutrition advice\",\n");
        prompt.append("  \"hydrationReminder\": \"Hydration reminder\",\n");
        prompt.append("  \"goals\": [\"Goal 1\", \"Goal 2\"],\n");
        prompt.append("  \"motivationalQuote\": \"Motivational quote\",\n");
        prompt.append("  \"targetSteps\": 10000,\n");
        prompt.append("  \"targetCalories\": 2000,\n");
        prompt.append("  \"restAndRecovery\": \"Rest and recovery advice\"\n");
        prompt.append("}\n\n");

        prompt.append("User Profile:\n");
        if (userProfile != null) {
            prompt.append("Name: ").append(userProfile.getFirstName()).append(" ").append(userProfile.getLastName()).append("\n");
            if (userProfile.getAge() != null) prompt.append("Age: ").append(userProfile.getAge()).append("\n");
            if (userProfile.getGender() != null) prompt.append("Gender: ").append(userProfile.getGender()).append("\n");
            if (userProfile.getHeight() != null) prompt.append("Height: ").append(userProfile.getHeight()).append(" cm\n");
            if (userProfile.getWeight() != null) prompt.append("Weight: ").append(userProfile.getWeight()).append(" kg\n");
            if (userProfile.getActivityLevel() != null) prompt.append("Activity Level: ").append(userProfile.getActivityLevel()).append("\n");
            if (userProfile.getFitnessGoals() != null) prompt.append("Fitness Goals: ").append(userProfile.getFitnessGoals()).append("\n");
            if (userProfile.getAreasToImprove() != null) prompt.append("Areas to Improve: ").append(userProfile.getAreasToImprove()).append("\n");
            if (userProfile.getWeaknesses() != null) prompt.append("Weaknesses: ").append(userProfile.getWeaknesses()).append("\n");
            if (userProfile.getHealthIssues() != null) prompt.append("Health Issues: ").append(userProfile.getHealthIssues()).append("\n");
            if (userProfile.getDietaryPreferences() != null) prompt.append("Dietary Preferences: ").append(userProfile.getDietaryPreferences()).append("\n");
            if (userProfile.getTargetWeeklyWorkouts() != null) prompt.append("Target Weekly Workouts: ").append(userProfile.getTargetWeeklyWorkouts()).append("\n");
        }

        prompt.append("\nDate: ").append(planDate.toString()).append("\n");
        prompt.append("\nCreate a personalized, realistic, and achievable daily plan considering:\n");
        prompt.append("- User's fitness level and goals\n");
        prompt.append("- Any health issues or weaknesses\n");
        prompt.append("- Dietary preferences and restrictions\n");
        prompt.append("- Day of the week and typical schedule\n");
        prompt.append("- Progressive difficulty based on target weekly workouts\n\n");
        prompt.append("Ensure the response follows the EXACT JSON format shown above.");

        return prompt.toString();
    }

    public List<DailyPlan> getUserPlans(String userId, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return dailyPlanRepository.findByUserIdAndPlanDateBetween(userId, startDate, endDate);
        }
        return dailyPlanRepository.findByUserId(userId);
    }

    public Optional<DailyPlan> getPlanByDate(String userId, LocalDate planDate) {
        return dailyPlanRepository.findByUserIdAndPlanDate(userId, planDate);
    }

    /**
     * Fetch an existing plan or generate a fresh one when missing (prevents 404s).
     */
    public DailyPlan getOrGeneratePlanByDate(String userId, LocalDate planDate) {
        return dailyPlanRepository.findByUserIdAndPlanDate(userId, planDate)
                .orElseGet(() -> {
                    DailyPlan generated = generateDailyPlan(userId, planDate)
                            .onErrorReturn(createDefaultDailyPlan(userId, planDate, null))
                            .block();
                    return generated != null ? generated : createDefaultDailyPlan(userId, planDate, null);
                });
    }

    /**
     * Allow users/admins to update an existing plan or upsert if missing.
     */
    public DailyPlan updatePlan(String userId, LocalDate planDate, DailyPlan request) {
        DailyPlan plan = dailyPlanRepository.findByUserIdAndPlanDate(userId, planDate)
                .orElse(createDefaultDailyPlan(userId, planDate, null));

        // Overwrite full sections when provided
        if (request.getMorningRoutine() != null) plan.setMorningRoutine(request.getMorningRoutine());
        if (request.getWorkouts() != null && !request.getWorkouts().isEmpty()) plan.setWorkouts(request.getWorkouts());
        if (request.getNutritionAdvice() != null) plan.setNutritionAdvice(request.getNutritionAdvice());
        if (request.getHydrationReminder() != null) plan.setHydrationReminder(request.getHydrationReminder());
        if (request.getGoals() != null && !request.getGoals().isEmpty()) plan.setGoals(request.getGoals());
        if (request.getMotivationalQuote() != null) plan.setMotivationalQuote(request.getMotivationalQuote());
        if (request.getTargetSteps() != null) plan.setTargetSteps(request.getTargetSteps());
        if (request.getTargetCalories() != null) plan.setTargetCalories(request.getTargetCalories());
        if (request.getRestAndRecovery() != null) plan.setRestAndRecovery(request.getRestAndRecovery());

        plan.setUserId(userId);
        plan.setPlanDate(planDate);
        if (plan.getCreatedAt() == null) {
            plan.setCreatedAt(LocalDateTime.now());
        }
        plan.setUpdatedAt(LocalDateTime.now());

        return dailyPlanRepository.save(plan);
    }
}
