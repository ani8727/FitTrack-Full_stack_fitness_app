package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.UserProfile;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;
    private final WebClient apiGatewayWebClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public Mono<Recommendation> generateRecommendation(Activity activity) {
        return fetchUserProfile(activity.getUserId())
                .flatMap(userProfile -> {
                    String prompt = createPromptForActivity(activity, userProfile);
                    return geminiService.getAnswer(prompt)
                            .map(aiResponse -> processAiResponse(activity, aiResponse))
                            .doOnNext(rec -> log.info("RESPONSE FROM AI: {}", rec.getRecommendation()))
                            .onErrorReturn(createDefaultRecommendation(activity));
                })
                .onErrorResume(e -> {
                    log.error("Error fetching user profile, using basic recommendation: {}", e.getMessage());
                    String prompt = createPromptForActivity(activity, null);
                    return geminiService.getAnswer(prompt)
                            .map(aiResponse -> processAiResponse(activity, aiResponse))
                            .onErrorReturn(createDefaultRecommendation(activity));
                });
    }

    private Mono<UserProfile> fetchUserProfile(String userId) {
        return apiGatewayWebClient.get()
            .uri("/api/users/{userId}", userId)
                .retrieve()
                .bodyToMono(UserProfile.class)
                .doOnError(e -> log.error("Error fetching user profile: {}", e.getMessage()));
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse){
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

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall: ");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (IOException | IllegalArgumentException e){
            log.error("Error occurred while generating recommendation: {}", e.getMessage(), e);
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty() ?
                Collections.singletonList("Follow general safety guidelines") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty() ?
                Collections.singletonList("No specific suggestions provided") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty() ?
                Collections.singletonList("No specific improvements provided") :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity, UserProfile userProfile) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:\n");
        prompt.append("{\n");
        prompt.append("  \"analysis\": {\n");
        prompt.append("    \"overall\": \"Overall analysis here\",\n");
        prompt.append("    \"pace\": \"Pace analysis here\",\n");
        prompt.append("    \"heartRate\": \"Heart rate analysis here\",\n");
        prompt.append("    \"caloriesBurned\": \"Calories analysis here\"\n");
        prompt.append("  },\n");
        prompt.append("  \"improvements\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"area\": \"Area name\",\n");
        prompt.append("      \"recommendation\": \"Detailed recommendation\"\n");
        prompt.append("    }\n");
        prompt.append("  ],\n");
        prompt.append("  \"suggestions\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"workout\": \"Workout name\",\n");
        prompt.append("      \"description\": \"Detailed workout description\"\n");
        prompt.append("    }\n");
        prompt.append("  ],\n");
        prompt.append("  \"safety\": [\n");
        prompt.append("    \"Safety point 1\",\n");
        prompt.append("    \"Safety point 2\"\n");
        prompt.append("  ]\n");
        prompt.append("}\n\n");

        prompt.append("Activity Details:\n");
        prompt.append("Type: ").append(activity.getType()).append("\n");
        prompt.append("Duration: ").append(activity.getDuration()).append(" minutes\n");
        prompt.append("Calories Burned: ").append(activity.getCaloriesBurned()).append("\n");
        prompt.append("Additional Metrics: ").append(activity.getAdditionalMetrics()).append("\n\n");

        if (userProfile != null) {
            prompt.append("User Profile Context:\n");
            prompt.append("Name: ").append(userProfile.getFirstName()).append(" ").append(userProfile.getLastName()).append("\n");
            if (userProfile.getAge() != null) prompt.append("Age: ").append(userProfile.getAge()).append("\n");
            if (userProfile.getGender() != null) prompt.append("Gender: ").append(userProfile.getGender()).append("\n");
            if (userProfile.getHeight() != null && userProfile.getWeight() != null) {
                double bmi = userProfile.getWeight() / Math.pow(userProfile.getHeight() / 100, 2);
                prompt.append("Height: ").append(userProfile.getHeight()).append(" cm\n");
                prompt.append("Weight: ").append(userProfile.getWeight()).append(" kg (BMI: ").append(String.format("%.1f", bmi)).append(")\n");
            }
            if (userProfile.getActivityLevel() != null) prompt.append("Activity Level: ").append(userProfile.getActivityLevel()).append("\n");
            if (userProfile.getFitnessGoals() != null) prompt.append("Fitness Goals: ").append(userProfile.getFitnessGoals()).append("\n");
            if (userProfile.getAreasToImprove() != null) prompt.append("Areas to Improve: ").append(userProfile.getAreasToImprove()).append("\n");
            if (userProfile.getWeaknesses() != null) prompt.append("Known Weaknesses: ").append(userProfile.getWeaknesses()).append("\n");
            if (userProfile.getHealthIssues() != null) prompt.append("Health Issues to Consider: ").append(userProfile.getHealthIssues()).append("\n");
            if (userProfile.getDietaryPreferences() != null) prompt.append("Dietary Preferences: ").append(userProfile.getDietaryPreferences()).append("\n");
            if (userProfile.getTargetWeeklyWorkouts() != null) prompt.append("Target Weekly Workouts: ").append(userProfile.getTargetWeeklyWorkouts()).append("\n");
        }

        prompt.append("\nProvide detailed analysis focusing on:\n");
        prompt.append("- Performance evaluation based on activity metrics\n");
        prompt.append("- Personalized improvements considering user's goals and weaknesses\n");
        prompt.append("- Next workout suggestions aligned with fitness goals\n");
        prompt.append("- Safety guidelines especially considering any health issues\n");
        prompt.append("- Specific advice based on user's activity level and areas to improve\n\n");
        prompt.append("Ensure the response follows the EXACT JSON format shown above.");

        return prompt.toString();
    }
}
