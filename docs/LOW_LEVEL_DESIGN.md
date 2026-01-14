# FitTrack - Low-Level Design Specifications

## Table of Contents
- [Service-Level Architecture](#service-level-architecture)
- [Database Schema Design](#database-schema-design)
- [API Contract Specifications](#api-contract-specifications)
- [Message Queue Contracts](#message-queue-contracts)
- [Security Implementation](#security-implementation)
- [Caching Strategy](#caching-strategy)

---

## Service-Level Architecture

### User Service Internal Design

#### Package Structure
```
com.fitness.userservice/
├── controller/          # REST API layer
│   ├── UserController
│   └── AccountController
├── service/             # Business logic layer
│   ├── UserService
│   ├── KeycloakService
│   ├── ContactService
│   └── AccountManagementService
├── repository/          # Data access layer
│   ├── UserRepository
│   └── ContactMessageRepository
├── model/              # Domain entities
│   ├── User
│   ├── ContactMessage
│   ├── UserRole (enum)
│   ├── AccountStatus (enum)
│   └── Gender (enum)
├── dto/                # Data transfer objects
│   ├── UserResponse
│   ├── RegisterRequest
│   ├── UpdateProfileRequest
│   └── OnboardingProgress
├── security/           # Security components
│   └── UserSecurity
└── config/            # Configuration
    └── SecurityConfig
```

#### User Entity Design
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;                    // Internal database ID
    
    @Column(unique = true, nullable = false)
    private String userId;                // Keycloak user ID (external reference)
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;
    
    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.ACTIVE;
    
    // Profile fields
    private Integer age;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    private Double height;              // in centimeters
    private Double weight;              // in kilograms
    private String fitnessGoals;        // JSON or comma-separated
    private String activityLevel;       // SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
    
    // Onboarding
    private Boolean onboardingCompleted = false;
    private String onboardingStep;      // Current step if incomplete
    
    // Audit fields
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private String statusReason;        // Reason for status changes
    private LocalDateTime lastLoginAt;
}
```

#### Service Layer Design
```java
@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final AccountManagementService accountManagementService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RabbitTemplate rabbitTemplate;
    
    // Business methods with caching
    @Cacheable(value = "users", key = "#userId")
    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        return UserMapper.toResponse(user);
    }
    
    @CacheEvict(value = "users", key = "#userId")
    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = findUserOrThrow(userId);
        updateUserFields(user, request);
        User saved = userRepository.save(user);
        
        // Publish event for other services
        publishUserUpdatedEvent(saved);
        
        return UserMapper.toResponse(saved);
    }
    
    // Event publishing
    private void publishUserUpdatedEvent(User user) {
        UserEvent event = UserEvent.builder()
            .userId(user.getUserId())
            .eventType("USER_PROFILE_UPDATED")
            .timestamp(Instant.now())
            .data(Map.of(
                "email", user.getEmail(),
                "fitnessGoals", user.getFitnessGoals(),
                "activityLevel", user.getActivityLevel()
            ))
            .build();
            
        rabbitTemplate.convertAndSend("user.exchange", "user.updated", event);
    }
}
```

### Activity Service Internal Design

#### MongoDB Document Structure
```java
@Document(collection = "activities")
public class Activity {
    @Id
    private String id;
    
    @Indexed
    private String userId;              // Reference to user from User Service
    
    private String name;                // Exercise name
    private String type;                // CARDIO, STRENGTH, FLEXIBILITY, SPORTS, etc.
    private String category;            // Running, Cycling, Weightlifting, etc.
    
    // Metrics
    private Integer duration;           // in minutes
    private Integer caloriesBurned;
    private Double distance;            // in kilometers (optional)
    private Integer steps;              // step count (optional)
    private Integer heartRate;          // average BPM (optional)
    
    // Strength training specific
    private List<Exercise> exercises;   // Sets, reps, weight details
    
    // Location and environment
    private String location;            // Indoor, Outdoor, Gym
    private WeatherCondition weather;   // Optional weather data
    
    // User input
    private String notes;
    private Integer intensity;          // 1-10 scale
    private String mood;                // Pre/post workout mood
    
    // Metadata
    @Indexed
    private LocalDateTime date;         // When the activity occurred
    
    @CreationTimestamp
    private LocalDateTime createdAt;    // When the record was created
    
    private String source;              // MANUAL, DEVICE_SYNC, API_IMPORT
    private Map<String, Object> metadata; // Flexible additional data
}

@Embeddable
public class Exercise {
    private String name;                // Exercise name (e.g., "Bench Press")
    private List<Set> sets;            // Individual sets
    
    @Embeddable
    public static class Set {
        private Integer reps;
        private Double weight;          // in kilograms
        private Integer duration;       // for time-based exercises (seconds)
        private String notes;
    }
}
```

#### Activity Service Business Logic
```java
@Service
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RabbitTemplate rabbitTemplate;
    
    public ActivityResponse trackActivity(ActivityRequest request) {
        // Validate and enrich activity data
        Activity activity = mapAndValidateActivity(request);
        
        // Calculate calories if not provided
        if (activity.getCaloriesBurned() == null) {
            activity.setCaloriesBurned(calculateCalories(activity));
        }
        
        Activity saved = activityRepository.save(activity);
        
        // Invalidate user statistics cache
        evictUserStatsCache(activity.getUserId());
        
        // Publish event for AI processing
        publishActivityRecordedEvent(saved);
        
        return ActivityMapper.toResponse(saved);
    }
    
    @Cacheable(value = "user_activity_stats", key = "#userId")
    public ActivityStatsResponse getUserActivityStats(String userId) {
        return activityRepository.calculateUserStats(userId);
    }
    
    private void publishActivityRecordedEvent(Activity activity) {
        ActivityEvent event = ActivityEvent.builder()
            .activityId(activity.getId())
            .userId(activity.getUserId())
            .eventType("ACTIVITY_RECORDED")
            .timestamp(Instant.now())
            .data(Map.of(
                "type", activity.getType(),
                "duration", activity.getDuration(),
                "calories", activity.getCaloriesBurned(),
                "date", activity.getDate()
            ))
            .build();
            
        rabbitTemplate.convertAndSend("activity.exchange", "activity.recorded", event);
    }
}
```

### AI Service Internal Design

#### AI Models and Analytics
```java
@Service
public class AIInsightsService {
    
    private final UserInsightsRepository insightsRepository;
    private final ActivityAnalyticsService analyticsService;
    private final RecommendationEngine recommendationEngine;
    
    @RabbitListener(queues = "activity.recorded.queue")
    public void processActivityEvent(ActivityEvent event) {
        try {
            // Generate insights for the user
            UserInsights insights = generateInsights(event.getUserId(), event.getData());
            
            // Update recommendations
            List<Recommendation> recommendations = recommendationEngine
                .generateRecommendations(event.getUserId(), insights);
            
            // Save to MongoDB
            insightsRepository.saveInsights(insights);
            insightsRepository.saveRecommendations(recommendations);
            
        } catch (Exception e) {
            // Handle processing errors, potentially retry
            log.error("Failed to process activity event: {}", event, e);
        }
    }
    
    public UserInsights generateInsights(String userId, Map<String, Object> activityData) {
        // Fetch user's historical data
        List<Activity> recentActivities = getRecentActivities(userId, 30); // Last 30 days
        
        // Calculate trends and patterns
        FitnessTrends trends = analyticsService.calculateTrends(recentActivities);
        
        // Generate personalized insights
        return UserInsights.builder()
            .userId(userId)
            .weeklyCaloriesBurned(trends.getWeeklyCalories())
            .averageWorkoutDuration(trends.getAverageWorkoutDuration())
            .preferredActivityTypes(trends.getPreferredTypes())
            .progressToGoals(calculateGoalProgress(userId, trends))
            .recommendations(generatePersonalizedTips(userId, trends))
            .generatedAt(Instant.now())
            .build();
    }
}

@Document(collection = "user_insights")
public class UserInsights {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    // Analytics
    private Integer weeklyCaloriesBurned;
    private Double averageWorkoutDuration;
    private List<String> preferredActivityTypes;
    private Map<String, Double> progressToGoals;
    
    // Insights and recommendations
    private List<String> recommendations;
    private List<Achievement> achievements;
    private FitnessScore fitnessScore;
    
    @CreationTimestamp
    private Instant generatedAt;
    
    private Instant expiresAt;          // TTL for insights
}
```

---

## Database Schema Design

### PostgreSQL Schema (User & Admin Services)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,  -- Keycloak ID
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
    
    -- Profile fields
    age INTEGER CHECK (age > 0 AND age < 120),
    gender VARCHAR(20) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')),
    height DECIMAL(5,2) CHECK (height > 0), -- in cm
    weight DECIMAL(5,2) CHECK (weight > 0), -- in kg
    fitness_goals TEXT,
    activity_level VARCHAR(20) CHECK (activity_level IN ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE')),
    
    -- Onboarding
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step VARCHAR(50),
    
    -- Audit
    status_reason TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    priority VARCHAR(20) DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_contact_messages_user_id ON contact_messages(user_id);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
```

### MongoDB Schema (Activity & AI Services)

```javascript
// Activities collection indexes
db.activities.createIndex({ "userId": 1 })
db.activities.createIndex({ "date": -1 })
db.activities.createIndex({ "userId": 1, "date": -1 })
db.activities.createIndex({ "type": 1 })
db.activities.createIndex({ "createdAt": -1 })

// User insights collection indexes
db.user_insights.createIndex({ "userId": 1 })
db.user_insights.createIndex({ "generatedAt": -1 })
db.user_insights.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })

// Recommendations collection indexes
db.recommendations.createIndex({ "userId": 1 })
db.recommendations.createIndex({ "type": 1 })
db.recommendations.createIndex({ "priority": -1 })
db.recommendations.createIndex({ "validUntil": 1 }, { expireAfterSeconds: 0 })
```

---

## API Contract Specifications

### User Service API

```yaml
# OpenAPI 3.0 specification for User Service
openapi: 3.0.3
info:
  title: User Service API
  version: 1.0.0
  description: User management and profile operations

paths:
  /api/users/{userId}:
    get:
      summary: Get user profile
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User profile retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '404':
          description: User not found
        '403':
          description: Access denied
    
    put:
      summary: Update user profile
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateProfileRequest'
      responses:
        '200':
          description: Profile updated successfully

  /api/users/register:
    post:
      summary: Register new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
      responses:
        '201':
          description: User registered successfully

components:
  schemas:
    UserResponse:
      type: object
      properties:
        id:
          type: string
        userId:
          type: string
        email:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        role:
          type: string
          enum: [USER, ADMIN]
        status:
          type: string
          enum: [ACTIVE, SUSPENDED, DEACTIVATED]
        age:
          type: integer
        gender:
          type: string
          enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]
        height:
          type: number
        weight:
          type: number
        fitnessGoals:
          type: string
        activityLevel:
          type: string
        onboardingCompleted:
          type: boolean
```

### Activity Service API

```yaml
# Activity Service API specification
openapi: 3.0.3
info:
  title: Activity Service API
  version: 1.0.0

paths:
  /api/activities:
    post:
      summary: Track new activity
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ActivityRequest'
      responses:
        '201':
          description: Activity tracked successfully
    
    get:
      summary: Get user activities
      parameters:
        - name: userId
          in: header
          required: true
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Activities retrieved

components:
  schemas:
    ActivityRequest:
      type: object
      required:
        - name
        - type
        - duration
      properties:
        name:
          type: string
          example: "Morning Run"
        type:
          type: string
          enum: [CARDIO, STRENGTH, FLEXIBILITY, SPORTS]
        duration:
          type: integer
          minimum: 1
        caloriesBurned:
          type: integer
        distance:
          type: number
        notes:
          type: string
        date:
          type: string
          format: date-time
```

---

## Message Queue Contracts

### RabbitMQ Exchange and Queue Configuration

```yaml
# RabbitMQ topology configuration
exchanges:
  user.exchange:
    type: topic
    durable: true
    bindings:
      - queue: ai.user.events
        routing_key: "user.#"
      - queue: analytics.user.events
        routing_key: "user.updated"

  activity.exchange:
    type: topic
    durable: true
    bindings:
      - queue: ai.activity.events
        routing_key: "activity.#"
      - queue: analytics.activity.events
        routing_key: "activity.recorded"

queues:
  ai.user.events:
    durable: true
    auto_delete: false
    
  ai.activity.events:
    durable: true
    auto_delete: false
    arguments:
      x-dead-letter-exchange: "dlx.exchange"
      x-message-ttl: 86400000  # 24 hours
      
  analytics.user.events:
    durable: true
    
  analytics.activity.events:
    durable: true
```

### Event Message Schemas

```java
// Base event structure
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "eventType")
@JsonSubTypes({
    @JsonSubTypes.Type(value = UserEvent.class, name = "USER_EVENT"),
    @JsonSubTypes.Type(value = ActivityEvent.class, name = "ACTIVITY_EVENT")
})
public abstract class BaseEvent {
    private String eventId;
    private String eventType;
    private Instant timestamp;
    private String correlationId;
    private Map<String, Object> metadata;
}

// User events
public class UserEvent extends BaseEvent {
    private String userId;
    private String action; // REGISTERED, PROFILE_UPDATED, STATUS_CHANGED
    private Map<String, Object> data;
    private String previousValues; // For audit trail
}

// Activity events
public class ActivityEvent extends BaseEvent {
    private String activityId;
    private String userId;
    private String action; // RECORDED, UPDATED, DELETED
    private Map<String, Object> data;
}
```

---

## Security Implementation

### JWT Token Validation

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtDecoder jwtDecoder;
    private final UserService userService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) {
        
        String token = extractTokenFromRequest(request);
        if (token != null) {
            try {
                Jwt jwt = jwtDecoder.decode(token);
                String userId = jwt.getSubject();
                List<String> roles = jwt.getClaimAsStringList("roles");
                
                // Create authentication object
                JwtAuthentication authentication = new JwtAuthentication(userId, roles);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // Add user context to headers for downstream services
                request.setAttribute("X-User-ID", userId);
                request.setAttribute("X-User-Roles", String.join(",", roles));
                
            } catch (JwtException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### Method-Level Security

```java
@Component("userSecurity")
public class UserSecurity {
    
    public boolean isOwner(String userId, String authenticatedUserId) {
        return userId.equals(authenticatedUserId);
    }
    
    public boolean canAccessUserData(String targetUserId, String authenticatedUserId, List<String> roles) {
        // Admin can access any user data
        if (roles.contains("ADMIN")) {
            return true;
        }
        
        // Users can only access their own data
        return targetUserId.equals(authenticatedUserId);
    }
    
    public boolean canModifyUser(String targetUserId, String authenticatedUserId, List<String> roles) {
        // Only admins can modify other users
        if (!targetUserId.equals(authenticatedUserId)) {
            return roles.contains("ADMIN");
        }
        
        // Users can modify their own data
        return true;
    }
}
```

---

## Caching Strategy

### Redis Cache Configuration

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
            
        return RedisCacheManager.builder(redisConnectionFactory)
            .cacheDefaults(config)
            .withCacheConfiguration("users", config.entryTtl(Duration.ofHours(1)))
            .withCacheConfiguration("user_activity_stats", config.entryTtl(Duration.ofMinutes(15)))
            .withCacheConfiguration("recommendations", config.entryTtl(Duration.ofHours(2)))
            .build();
    }
}
```

### Caching Annotations Usage

```java
@Service
public class UserService {
    
    @Cacheable(value = "users", key = "#userId", unless = "#result == null")
    public UserResponse getUserProfile(String userId) {
        // Implementation
    }
    
    @CacheEvict(value = "users", key = "#userId")
    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        // Implementation
    }
    
    @Cacheable(value = "user_activity_stats", key = "#userId")
    public ActivityStatsResponse getUserActivityStats(String userId) {
        // Implementation
    }
    
    @CacheEvict(value = {"users", "user_activity_stats"}, key = "#userId")
    public void invalidateUserCaches(String userId) {
        // Explicit cache invalidation
    }
}
```

This comprehensive low-level design provides the detailed technical specifications needed for implementing and maintaining the FitTrack fitness application.