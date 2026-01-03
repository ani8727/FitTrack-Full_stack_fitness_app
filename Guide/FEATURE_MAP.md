# 🗺️ FitTrack Feature Map & Documentation Navigator

## 🎯 Quick Navigation

### 🚀 Want to Get Started?
→ Read **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** first!  
→ Then follow **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** for setup

### 🧪 Ready to Test?
→ Use **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** step-by-step

### 👤 Need Account Features Info?
→ Check **[ACCOUNT_MANAGEMENT_GUIDE.md](ACCOUNT_MANAGEMENT_GUIDE.md)**

### 🤖 Want to Learn About AI Features?
→ See **[ENHANCED_FEATURES_GUIDE.md](ENHANCED_FEATURES_GUIDE.md)**

### 👨‍💼 Planning Admin Dashboard?
→ Review **[ADMIN_FEATURES_RECOMMENDATIONS.md](ADMIN_FEATURES_RECOMMENDATIONS.md)**

---

## 📊 Complete Feature Map

```
┌─────────────────────────────────────────────────────────────────┐
│                      FITTRACK APPLICATION                         │
│                    Full Feature Overview                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │                           │
        ┌───────▼───────┐          ┌───────▼────────┐
        │  USER JOURNEY  │          │  ADMIN PORTAL  │
        └───────┬───────┘          └───────┬────────┘
                │                           │
    ┌───────────┼───────────┐              │
    │                       │              │
┌───▼────┐            ┌────▼─────┐  ┌─────▼──────┐
│ ENTRY  │            │  USAGE   │  │  MANAGE    │
└───┬────┘            └────┬─────┘  └─────┬──────┘
    │                      │              │
    │                      │              │
```

---

## 🔵 USER JOURNEY - Entry Phase

### 1. Registration
**File**: `fitness-app-frontend/src/pages/RegisterPage.jsx`  
**API**: `POST /api/users/register`  
**Features**:
- Username, email, password input
- Form validation
- Error handling
- Success redirect

### 2. Login
**File**: `fitness-app-frontend/src/pages/LoginPage.jsx`  
**API**: `POST /api/auth/login` (via Keycloak)  
**Features**:
- OAuth2 PKCE flow
- JWT token management
- "Remember me" option (future)
- Forgot password link (future)

### 3. Onboarding Wizard ✨ NEW
**File**: `fitness-app-frontend/src/pages/OnboardingWizard.jsx`  
**API**: 
- `PUT /api/users/{userId}/profile` (update profile)
- `POST /api/users/{userId}/onboarding/complete` (mark complete)

**Flow**:
```
Step 1: Basic Info
├─ Gender (Male/Female/Other/Prefer not to say)
└─ Age

Step 2: Physical Stats
├─ Height (cm)
└─ Weight (kg)

Step 3: Fitness Goals
├─ Activity Level (Sedentary → Very Active)
├─ Fitness Goals (textarea)
├─ Weaknesses (textarea)
├─ Health Issues (textarea)
├─ Daily Plan Preference (textarea)
└─ Weekly Activity Target (hours)

Step 4: Completion
├─ Success message
├─ What's next guide
└─ Auto-redirect to dashboard
```

**Features**:
- ✅ Progress bar with step indicators
- ✅ Step validation
- ✅ Back/Next navigation
- ✅ Form state persistence
- ✅ Responsive design
- ✅ Smooth animations

---

## 🟢 USER JOURNEY - Usage Phase

### 4. Dashboard
**File**: `fitness-app-frontend/src/pages/Dashboard.jsx`  
**Features**:
- Welcome message
- Quick stats
- Recent activities
- Upcoming plans
- Action buttons

### 5. Profile Management
**File**: `fitness-app-frontend/src/pages/ProfileUpdatePage.jsx`  
**API**: `PUT /api/users/{userId}/profile`  
**Features**:
- View all profile fields
- Edit extended profile (15+ fields)
- Save changes
- Success notifications

**Extended Profile Fields** ✨ NEW:
```
Basic Info:
├─ Username
├─ Email
├─ Gender
└─ Age

Physical Stats:
├─ Height
├─ Weight
└─ Place (location)

Fitness Data:
├─ Activity Level
├─ Fitness Goals
├─ Weaknesses
├─ Health Issues
├─ Daily Plan Preference
└─ Weekly Activity Target
```

### 6. Activity Tracking
**File**: `fitness-app-frontend/src/pages/ActivitiesPage.jsx`  
**API**: 
- `GET /api/activities/user/{userId}` (list)
- `POST /api/activities` (create)
- `PUT /api/activities/{id}` (update)
- `DELETE /api/activities/{id}` (delete)

**Features**:
- View activity history
- Log new activity
- Edit existing activities
- Delete activities
- Filter by date/type

### 7. AI Recommendations ✨ ENHANCED
**File**: `fitness-app-frontend/src/pages/RecommendationsPage.jsx`  
**API**: `POST /api/activities/recommend`  
**Features**:
- Request personalized recommendation
- View AI-generated advice
- Uses extended profile data
- Context-aware suggestions
- Save recommendations

**Personalization Based On**:
- User's goals
- Current fitness level
- Weaknesses to address
- Health issues to consider
- Activity history
- Daily plan preferences

### 8. Daily Plans ✨ NEW
**File**: `fitness-app-frontend/src/pages/DailyPlanPage.jsx`  
**API**: 
- `POST /api/daily-plans` (generate)
- `GET /api/daily-plans/user/{userId}` (list)

**Features**:
- Date picker for any day
- Generate AI-powered daily plan
- Morning workout routine
- Afternoon activities
- Evening exercises
- Nutrition recommendations
- Hydration goals
- View historical plans

**Sample Daily Plan**:
```
🌅 MORNING (6:00 AM - 8:00 AM)
├─ Warm-up: 5 min stretching
├─ Cardio: 20 min jogging
└─ Cool-down: 5 min walking

🌞 AFTERNOON (12:00 PM - 1:00 PM)
├─ Strength: 15 min resistance training
├─ Core: 10 min ab exercises
└─ Flexibility: 5 min yoga

🌙 EVENING (7:00 PM - 8:00 PM)
├─ Light cardio: 15 min cycling
└─ Meditation: 10 min mindfulness

🍎 NUTRITION
- Balanced meals with protein, carbs, healthy fats
- [Specific recommendations based on goals]

💧 HYDRATION
- 8-10 glasses of water throughout the day
```

### 9. Account Settings ✨ NEW
**File**: `fitness-app-frontend/src/pages/AccountSettingsPage.jsx`  
**APIs**: 
- `POST /api/users/{userId}/deactivate`
- `DELETE /api/users/{userId}/delete`
- `POST /api/users/{userId}/reactivate`

**Sections**:

**A. Account Information**
```
├─ Email: user@example.com
├─ Username: johndoe
└─ Account ID: 12345-67890
```

**B. Danger Zone** ⚠️
```
┌──────────────────────────────────────┐
│  ⚠️ DEACTIVATE ACCOUNT (Yellow)      │
│  • Temporary suspension              │
│  • Can be reactivated                │
│  • Data preserved                    │
│  • Requires password                 │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  🚨 DELETE ACCOUNT (Red)             │
│  • Permanent deletion                │
│  • Cannot be undone                  │
│  • All data removed                  │
│  • Requires password                 │
└──────────────────────────────────────┘
```

**Deactivation Modal**:
- Warning message
- Optional reason field
- Password verification
- Confirm/Cancel buttons
- Auto-logout on success

**Deletion Modal**:
- Strong warning ("This cannot be undone!")
- Data loss notice
- Optional feedback field
- Password verification
- "Delete Forever" button (red)
- Auto-logout and redirect on success

---

## 🔴 ADMIN PORTAL - Management Phase

### 10. Admin Dashboard (Planned)
**File**: `adminservice/controller/AdminDashboardController.java`  
**API**: `GET /api/admin/dashboard/overview`  
**Features** (Recommended):
```
Overview Panel:
├─ Total Users: 1,247
├─ Active Users: 892 (71.5%)
├─ Deactivated: 23
├─ Deleted: 12
├─ New Today: 5
├─ Total Activities: 5,432
└─ Daily Plans Generated: 3,198

Charts:
├─ User growth over time (line chart)
├─ Activity distribution (pie chart)
├─ Peak usage hours (bar chart)
└─ Retention rate (trend)
```

### 11. User Management (Planned)
**Features**:
- Search users (by username, email, ID)
- Filter by status (active, deactivated, deleted, etc.)
- View user details
- View user activities
- View AI recommendations
- Suspend account (admin action)
- Ban account (permanent)
- Reactivate account
- Permanently purge deleted accounts
- Send email to user
- Generate user report

### 12. Activity Monitoring (Planned)
**Features**:
- View all activities across users
- Filter by date range
- Filter by activity type
- Popular activities report
- Peak usage times
- Inactive user detection

### 13. System Analytics (Planned)
**Features**:
- DAU/WAU/MAU (Daily/Weekly/Monthly Active Users)
- User retention rates (1-day, 7-day, 30-day)
- Feature usage statistics
- API performance metrics
- Error rates and logging
- AI service usage (API calls, tokens)

---

## 🏗️ Backend Architecture

### Microservices:

**1. User Service** (Port 8081)
```
Controllers:
├─ UserController
│  ├─ POST /api/users/register
│  ├─ GET /api/users/{userId}
│  ├─ PUT /api/users/{userId}
│  └─ PUT /api/users/{userId}/profile
│
├─ AccountManagementController ✨ NEW
   ├─ POST /api/users/{userId}/deactivate
   ├─ DELETE /api/users/{userId}/delete
   ├─ POST /api/users/{userId}/reactivate
   ├─ POST /api/users/{userId}/onboarding/complete
   └─ GET /api/users/{userId}/onboarding/status

Services:
├─ UserService
└─ AccountManagementService ✨ NEW

Models:
├─ User (enhanced with 6 new fields)
├─ AccountStatus (enum with 6 states) ✨ NEW
├─ UpdateProfileRequest (DTO)
├─ AccountActionRequest (DTO) ✨ NEW
└─ OnboardingProgress (DTO) ✨ NEW
```

**2. Activity Service** (Port 8082)
```
Controllers:
├─ ActivityController
│  ├─ GET /api/activities/user/{userId}
│  ├─ POST /api/activities
│  ├─ PUT /api/activities/{id}
│  └─ DELETE /api/activities/{id}
│
├─ ActivityAIController ✨ ENHANCED
   └─ POST /api/activities/recommend (uses profile data)

Services:
├─ ActivityService
└─ ActivityAIService ✨ ENHANCED

Models:
├─ Activity
└─ Recommendation
```

**3. AI Service** (Port 8084) ✨ NEW
```
Controllers:
├─ DailyPlanController
   ├─ POST /api/daily-plans
   └─ GET /api/daily-plans/user/{userId}

Services:
├─ DailyPlanService
│  └─ generateDailyPlan(userId, date)

Models:
├─ DailyPlan
│  ├─ morning: WorkoutPlan
│  ├─ afternoon: WorkoutPlan
│  ├─ evening: WorkoutPlan
│  ├─ nutrition: String
│  └─ hydration: String
│
└─ WorkoutPlan
   └─ exercises: List<Exercise>
```

**4. Admin Service** (Port 8083)
```
Controllers:
├─ AdminController (existing)
└─ AdminDashboardController (planned)

Services:
└─ AdminAnalyticsService (planned)

DTOs:
└─ AdminAnalytics ✨ NEW (foundation laid)
```

**5. API Gateway** (Port 8085)
```
Routes:
├─ /api/users/** → User Service
├─ /api/activities/** → Activity Service
├─ /api/daily-plans/** → AI Service
└─ /api/admin/** → Admin Service

Features:
├─ Load balancing
├─ Request routing
├─ CORS configuration
└─ Service discovery via Eureka
```

---

## 🗄️ Database Schema

### MySQL (userdb.users table):

**Original Fields**:
```sql
id (VARCHAR PRIMARY KEY)
username (VARCHAR UNIQUE)
email (VARCHAR UNIQUE)
password (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**Extended Profile Fields** ✨ ADDED:
```sql
gender (VARCHAR)
age (INT)
height (DOUBLE)
weight (DOUBLE)
place (VARCHAR)
fitness_goals (TEXT)
weaknesses (TEXT)
health_issues (TEXT)
daily_plan_preference (TEXT)
activity_level (VARCHAR)
weekly_activity_target (INT)
```

**Account Management Fields** ✨ NEW:
```sql
account_status (VARCHAR DEFAULT 'ACTIVE')
email_verified (BOOLEAN DEFAULT FALSE)
onboarding_completed (BOOLEAN DEFAULT FALSE)
last_login_at (TIMESTAMP NULL)
deactivated_at (TIMESTAMP NULL)
deactivation_reason (TEXT NULL)
```

### MongoDB (activitydb):

**Collections**:
```javascript
// activities
{
  _id: ObjectId,
  userId: String,
  type: String,
  duration: Number,
  calories: Number,
  date: ISODate,
  notes: String,
  createdAt: ISODate
}

// recommendations
{
  _id: ObjectId,
  userId: String,
  recommendation: String,
  createdAt: ISODate
}

// dailyPlans ✨ NEW
{
  _id: ObjectId,
  userId: String,
  date: String,
  morning: {
    exercises: [...],
    duration: Number
  },
  afternoon: {
    exercises: [...],
    duration: Number
  },
  evening: {
    exercises: [...],
    duration: Number
  },
  nutrition: String,
  hydration: String,
  createdAt: ISODate
}
```

---

## 📱 Frontend Routes

```
Public Routes:
├─ / → HomePage (landing page)
├─ /login → LoginPage
└─ /register → RegisterPage

Protected Routes (require auth):
├─ /dashboard → Dashboard
├─ /activities → ActivitiesPage
├─ /recommendations → RecommendationsPage
├─ /daily-plan → DailyPlanPage ✨ NEW
├─ /profile → ProfileUpdatePage
└─ /settings/account → AccountSettingsPage ✨ NEW

Conditional Routes:
└─ (auto-display) OnboardingWizard ✨ NEW
   (shown after first login if not completed)
```

---

## 🎨 UI Components

### Reusable Components:
```
shared/ui/
├─ Sidebar.jsx (navigation menu)
├─ Header.jsx (top bar)
├─ Footer.jsx
├─ Button.jsx
├─ Input.jsx
├─ Card.jsx
├─ Modal.jsx ✨ USED IN
│  ├─ AccountSettingsPage (deactivate/delete modals)
│  └─ Future use cases
└─ LoadingSpinner.jsx
```

### Page Components:
```
pages/
├─ HomePage.jsx
├─ LoginPage.jsx
├─ RegisterPage.jsx
├─ Dashboard.jsx
├─ ActivitiesPage.jsx
├─ RecommendationsPage.jsx
├─ ProfileUpdatePage.jsx
├─ DailyPlanPage.jsx ✨ NEW
├─ AccountSettingsPage.jsx ✨ NEW
└─ OnboardingWizard.jsx ✨ NEW
```

### Feature Components:
```
components/
├─ ActivityList.jsx
├─ ActivityForm.jsx
├─ RecommendationCard.jsx
├─ DailyPlanCard.jsx ✨ NEW
├─ ProfileForm.jsx
├─ StepIndicator.jsx ✨ NEW (for onboarding)
└─ ProgressBar.jsx ✨ NEW
```

---

## 🔐 Security Features

### Implemented:
✅ OAuth2 PKCE authentication (Keycloak)  
✅ JWT token-based authorization  
✅ Password encryption (BCrypt)  
✅ Password verification for deletion/deactivation  
✅ Account status validation on login  
✅ CORS configuration  
✅ HTTPS support (Spring Boot)  
✅ Audit trail (timestamps, reasons)  

### Recommended (Future):
⏳ Email verification before activation  
⏳ Two-factor authentication (2FA)  
⏳ Rate limiting (prevent brute force)  
⏳ Session management (view/revoke)  
⏳ CAPTCHA for registration  
⏳ Password strength requirements  
⏳ Account lockout after failed attempts  

---

## 🚀 Deployment

### Development:
```bash
# Start all services
cd c:\Users\anike\Desktop\Project\fitness_app
start-all.bat

# Or individually:
docker-compose up -d  # Databases
# Start each Spring Boot service
# npm run dev (in frontend folder)
```

### Production (Recommended):
```yaml
Infrastructure:
├─ Kubernetes cluster
├─ Docker containers for each service
├─ Load balancer (NGINX/Traefik)
├─ Managed databases (RDS, Atlas)
├─ Redis cache
├─ CDN for static assets
├─ SSL certificates (Let's Encrypt)
└─ Monitoring (Prometheus, Grafana)
```

---

## 📊 Metrics to Track

### User Metrics:
- Total users
- Active users (daily, weekly, monthly)
- New registrations
- Onboarding completion rate
- Account deactivations
- Account deletions
- Reactivations

### Engagement Metrics:
- Activities logged per user
- Daily plans generated
- AI recommendations requested
- Average session duration
- Feature usage distribution

### Technical Metrics:
- API response times (p50, p95, p99)
- Error rates
- Uptime/availability
- Database query performance
- Cache hit ratio
- Service health status

---

## 🎯 Roadmap

### ✅ Phase 1 (Completed - Jan 2, 2026):
- User registration & authentication
- Activity tracking
- AI recommendations
- Daily plan generation
- Extended user profiles
- **Account lifecycle management**
- **4-step onboarding wizard**
- **Account settings page**

### ⏳ Phase 2 (Next 1-2 months):
- Admin dashboard with analytics
- Progress tracking with charts
- Notifications system
- Email verification
- Password reset
- Achievement badges

### ⏳ Phase 3 (3-6 months):
- Social features (friends, challenges)
- Mobile app (React Native)
- Premium subscription
- Advanced analytics
- Marketplace/integrations

### ⏳ Phase 4 (6-12 months):
- AI coach (conversational)
- Video workout library
- Live classes
- Nutrition tracking
- Meal planning
- Wearable device integration

---

## 📚 Documentation Index

### 🌟 Start Here:
1. **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** - Complete summary
2. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick start & commands

### 📖 User Guides:
- **[USER_APPLICATION_GUIDE.md](USER_APPLICATION_GUIDE.md)** - End user manual
- **[USER_GUIDE.md](USER_GUIDE.md)** - Additional user documentation

### 🔧 Developer Guides:
- **[ACCOUNT_MANAGEMENT_GUIDE.md](ACCOUNT_MANAGEMENT_GUIDE.md)** - Account features (NEW)
- **[ENHANCED_FEATURES_GUIDE.md](ENHANCED_FEATURES_GUIDE.md)** - AI features (NEW)
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Development setup
- **[API-DOCUMENTATION.md](API-DOCUMENTATION.md)** - API reference

### 🧪 Testing:
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Complete testing guide (NEW)

### 👨‍💼 Admin:
- **[ADMIN_FEATURES_RECOMMENDATIONS.md](ADMIN_FEATURES_RECOMMENDATIONS.md)** - Admin roadmap (NEW)

### 🚀 Setup & Deployment:
- **[QUICK_START.md](QUICK_START.md)** - Quick setup
- **[COMPLETE_STARTUP_GUIDE.md](COMPLETE_STARTUP_GUIDE.md)** - Full setup
- **[KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)** - OAuth2 setup
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Containerization

---

## 🎉 Congratulations!

You now have a complete map of the FitTrack application with all its features, documentation, and implementation details!

**Next Steps:**
1. Read **IMPLEMENTATION_COMPLETE.md** for the full picture
2. Follow **TESTING_CHECKLIST.md** to test everything
3. Use **QUICK_REFERENCE.md** for commands and troubleshooting
4. Explore **ADMIN_FEATURES_RECOMMENDATIONS.md** for future enhancements

**Happy coding! 💪🚀**
