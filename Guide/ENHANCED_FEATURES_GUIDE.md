# Enhanced Features Implementation Guide

## Overview
This document describes the newly implemented features for personalized fitness tracking and AI-powered recommendations in the FitTrack application.

## New Features

### 1. Extended User Profile
Users can now add comprehensive personal information to receive highly personalized fitness recommendations.

#### Backend Changes

**User Model Extended Fields** (`userservice/src/main/java/com/fitness/userservice/model/User.java`)
```java
private Gender gender;                    // Gender enum (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
private Integer age;                      // User's age
private String location;                  // City, Country
private String fitnessGoals;             // Max 1000 characters
private String areasToImprove;           // Max 1000 characters
private String weaknesses;               // Max 1000 characters
private String healthIssues;             // Max 1000 characters
private Double height;                    // Height in cm
private Double weight;                    // Weight in kg
private String activityLevel;            // Sedentary, Lightly Active, etc.
private String dietaryPreferences;       // Max 500 characters
private Integer targetWeeklyWorkouts;    // Number of workouts per week
```

**New Endpoint**
```
PUT /api/users/{userId}/profile
```
Updates user profile with all extended fields.

#### Frontend Changes

**Enhanced Profile Form** (`fitness-app-frontend/src/pages/ProfileUpdatePage.jsx`)
- Gender dropdown (4 options)
- Age number input
- Location text field
- Height/Weight inputs (cm/kg)
- Activity level dropdown (5 levels)
- Target weekly workouts number
- Fitness goals textarea (1000 chars)
- Areas to improve textarea (1000 chars)
- Weaknesses textarea (1000 chars)
- Health issues textarea (1000 chars)
- Dietary preferences textarea (500 chars)

### 2. AI-Powered Daily Plans

#### Backend Implementation

**New Model** (`aiservice/src/main/java/com/fitness/aiservice/model/DailyPlan.java`)
```java
@Document(collection = "daily_plans")
public class DailyPlan {
    private String id;
    private String userId;
    private LocalDate planDate;
    private String morningRoutine;
    private List<WorkoutPlan> workouts;
    private String nutritionAdvice;
    private String hydrationReminder;
    private List<String> goals;
    private String motivationalQuote;
    private Integer targetSteps;
    private Integer targetCalories;
    private String restAndRecovery;
    
    @Data
    public static class WorkoutPlan {
        private String time;              // Morning/Afternoon/Evening
        private String type;              // Cardio/Strength/Flexibility
        private Integer duration;         // Duration in minutes
        private String intensity;         // Low/Moderate/High
        private String description;       // Workout description
        private List<String> exercises;   // List of exercises
    }
}
```

**Daily Plan Service** (`aiservice/src/main/java/com/fitness/aiservice/service/DailyPlanService.java`)
- Fetches user profile from User Service
- Generates personalized daily plans using Gemini AI
- Considers user's goals, health issues, weaknesses, activity level
- Stores plans in MongoDB with date indexing

**New Endpoints**
```
POST /api/daily-plans/generate/{userId}?date=2026-01-15
GET  /api/daily-plans/user/{userId}/date/2026-01-15
GET  /api/daily-plans/user/{userId}?startDate=2026-01-01&endDate=2026-01-31
```

#### Frontend Implementation

**Daily Plan Page** (`fitness-app-frontend/src/pages/DailyPlanPage.jsx`)

Features:
- Date picker for selecting plan date
- One-click plan generation
- Beautiful card-based UI showing:
  - Target steps and calories
  - Number of workouts
  - Motivational quote
  - Morning routine
  - Detailed workout schedule with:
    - Time of day (with icons)
    - Workout type and intensity (color-coded)
    - Duration
    - Description
    - Exercise list
  - Today's goals
  - Nutrition advice
  - Hydration reminder
  - Rest and recovery tips

**Navigation**
- New "Daily Plan" menu item in sidebar with calendar icon
- Route: `/daily-plan`

### 3. Enhanced AI Recommendations

#### Backend Improvements

**Activity AI Service Enhancement** (`aiservice/src/main/java/com/fitness/aiservice/service/ActivityAIService.java`)

The AI service now:
- Fetches user profile before generating recommendations
- Includes comprehensive context in AI prompts:
  - Age, gender, BMI calculation
  - Activity level
  - Fitness goals
  - Known weaknesses
  - Health issues to consider
  - Dietary preferences
  - Target weekly workouts

**Personalization Benefits**
- Recommendations consider health conditions
- Safety guidelines tailored to specific issues
- Workout suggestions aligned with goals
- Intensity adjusted based on activity level
- Recovery advice based on weaknesses

## API Integration

### Updated API Service
```javascript
// Extended profile update
export const updateUserProfile = (userId, userData) => 
    api.put(`/users/${userId}/profile`, userData);

// Daily plan APIs
export const generateDailyPlan = (userId, date) => 
    api.post(`/daily-plans/generate/${userId}?date=${date}`);

export const getDailyPlanByDate = (userId, date) => 
    api.get(`/daily-plans/user/${userId}/date/${date}`);

export const getUserDailyPlans = (userId, startDate, endDate) => 
    api.get(`/daily-plans/user/${userId}?startDate=${startDate}&endDate=${endDate}`);
```

## Database Schema Updates

### MySQL - userservice (User Table)
Added 12 new columns:
- `gender` VARCHAR(50)
- `age` INT
- `location` VARCHAR(255)
- `fitness_goals` TEXT(1000)
- `areas_to_improve` TEXT(1000)
- `weaknesses` TEXT(1000)
- `health_issues` TEXT(1000)
- `height` DOUBLE
- `weight` DOUBLE
- `activity_level` VARCHAR(50)
- `dietary_preferences` VARCHAR(500)
- `target_weekly_workouts` INT

### MongoDB - aiservice
New collection: `daily_plans`
```javascript
{
  _id: ObjectId,
  userId: String,
  planDate: ISODate,
  morningRoutine: String,
  workouts: [{
    time: String,
    type: String,
    duration: Number,
    intensity: String,
    description: String,
    exercises: [String]
  }],
  nutritionAdvice: String,
  hydrationReminder: String,
  goals: [String],
  motivationalQuote: String,
  targetSteps: Number,
  targetCalories: Number,
  restAndRecovery: String,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## User Workflow

### Complete Your Profile
1. Navigate to Profile → Edit Profile
2. Fill in personal details (age, gender, location)
3. Add physical stats (height, weight)
4. Set activity level and weekly workout targets
5. Describe fitness goals
6. List areas to improve and weaknesses
7. Mention any health issues
8. Add dietary preferences
9. Save profile

### Get AI-Powered Daily Plans
1. Navigate to Daily Plan from sidebar
2. Select a date using date picker
3. Click "Generate Plan"
4. AI analyzes your profile and creates:
   - Personalized morning routine
   - Customized workout schedule
   - Nutrition and hydration advice
   - Daily goals aligned with your objectives
   - Rest and recovery tips
   - Motivational quote

### Enhanced Activity Recommendations
1. Log an activity as usual
2. AI automatically generates recommendations considering:
   - Your fitness goals
   - Known weaknesses
   - Health issues
   - Activity level
   - Target workout frequency
3. Receive personalized:
   - Performance analysis
   - Specific improvements based on goals
   - Next workout suggestions
   - Safety guidelines for your conditions

## Technical Architecture

### Microservices Communication
```
Frontend (React)
    ↓
API Gateway :8085
    ↓
├─ User Service :8081 (MySQL)
│   └─ Stores extended profile data
│
└─ AI Service :8084 (MongoDB)
    ├─ Fetches user profile from User Service
    ├─ Generates daily plans via Gemini AI
    ├─ Creates activity recommendations
    └─ Stores plans and recommendations
```

### AI Integration Flow

**Daily Plan Generation**
1. Frontend calls `/api/daily-plans/generate/{userId}?date=...`
2. AI Service fetches user profile from User Service
3. Creates personalized prompt with all profile data
4. Calls Gemini AI API with structured JSON format
5. Parses AI response into DailyPlan model
6. Saves to MongoDB
7. Returns to frontend

**Activity Recommendation**
1. User logs activity → Activity Service → RabbitMQ
2. AI Service consumes message
3. Fetches user profile
4. Creates context-aware prompt
5. Gets AI analysis from Gemini
6. Stores recommendation in MongoDB
7. Available via Recommendations page

## Benefits

### For Users
- **Highly Personalized**: Every recommendation considers your unique profile
- **Safety First**: AI respects health issues and physical limitations
- **Goal-Oriented**: Plans align with your specific fitness objectives
- **Comprehensive**: Covers workouts, nutrition, hydration, recovery
- **Motivating**: Daily motivational quotes and achievable goals

### For the Application
- **Rich User Profiles**: Detailed data for better insights
- **Scalable**: MongoDB handles complex nested plan structures
- **Intelligent**: Gemini AI provides context-aware advice
- **Flexible**: Plans can be generated for any date
- **Maintainable**: Clean separation of concerns

## Testing the Features

### Test Profile Update
```bash
curl -X PUT http://localhost:8085/api/users/{userId}/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "gender": "MALE",
    "age": 30,
    "height": 175,
    "weight": 75,
    "activityLevel": "Moderately Active",
    "fitnessGoals": "Build muscle and improve endurance",
    "healthIssues": "Mild knee pain",
    "targetWeeklyWorkouts": 4
  }'
```

### Test Daily Plan Generation
```bash
curl -X POST http://localhost:8085/api/daily-plans/generate/{userId}?date=2026-01-15 \
  -H "Authorization: Bearer {token}"
```

### Verify in Frontend
1. Login to application
2. Go to Profile → Edit
3. Fill in all fields and save
4. Go to Daily Plan
5. Click Generate Plan
6. View personalized plan
7. Log an activity
8. Check enhanced recommendations

## Future Enhancements

### Potential Improvements
- **Progress Tracking**: Compare plans vs actual activities
- **Plan Templates**: Save and reuse successful plans
- **Weekly Plans**: Generate plans for entire week
- **Social Features**: Share plans with friends
- **Wearable Integration**: Import data from fitness trackers
- **Meal Plans**: Detailed meal suggestions with recipes
- **Video Exercises**: Embedded workout videos
- **Coach Mode**: Live feedback during workouts
- **Achievement System**: Badges and milestones
- **Community Challenges**: Group goals and competitions

## Troubleshooting

### Profile Not Loading
- Ensure User Service is running on port 8081
- Check userId is correct (from token sub claim)
- Verify database connection

### Daily Plan Generation Fails
- Confirm profile is complete (at least basic fields)
- Check AI Service has Gemini API key configured
- Verify MongoDB connection
- Check User Service is accessible from AI Service

### Recommendations Not Personalized
- Ensure profile has been saved with detailed information
- Verify AI Service can fetch user profile
- Check RabbitMQ message processing
- Review AI Service logs for errors

## Configuration

### Environment Variables

**User Service**
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/userdb
```

**AI Service**
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/fitnessai
gemini.api.key=${GEMINI_API_KEY}
eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka/
```

**Frontend**
```javascript
const API_URL = 'http://localhost:8085/api';
```

## Conclusion

These enhancements transform FitTrack into a truly intelligent fitness companion. By combining comprehensive user profiles with AI-powered analysis, users receive personalized guidance that adapts to their unique goals, limitations, and preferences. The daily plan feature provides structured, achievable daily goals, while enhanced recommendations ensure every activity contributes meaningfully to their fitness journey.
