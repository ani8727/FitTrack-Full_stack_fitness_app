# 🏃 FitTrack - Complete User & Application Guide

## Table of Contents
- [Getting Started](#getting-started)
- [Accessing the Application](#accessing-the-application)
- [User Registration & Login](#user-registration--login)
- [User Features & How to Use](#user-features--how-to-use)
- [Admin Features & Dashboard](#admin-features--dashboard)
- [AI Recommendations System](#ai-recommendations-system)
- [Profile Management](#profile-management)
- [Frontend Architecture Deep Dive](#frontend-architecture-deep-dive)
- [How Everything Works Together](#how-everything-works-together)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
Before accessing the application, ensure all services are running:

1. ✅ **Docker Services** (MySQL, MongoDB, RabbitMQ, Keycloak, Redis)
2. ✅ **Backend Services** (Config Server, Eureka, Gateway, User/Activity/AI/Admin Services)
3. ✅ **Frontend** (React Application)

**Quick Start Command:**
```bash
cd c:\Users\anike\Desktop\Project\fitness_app
docker-compose up -d
start-all.bat
```

---

## Accessing the Application

### 🌐 Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Main Application** | http://localhost:5173 | Primary user interface |
| **API Gateway** | http://localhost:8085 | Backend API endpoint |
| **Eureka Dashboard** | http://localhost:8761 | Service registry (monitoring) |
| **RabbitMQ Management** | http://localhost:15672 | Message queue monitoring |
| **Keycloak Admin** | http://localhost:8181 | User & auth management |

### 🔑 Default Admin Access

**Keycloak Admin Console:**
- URL: http://localhost:8181
- Username: `admin`
- Password: `admin`

**RabbitMQ Management:**
- URL: http://localhost:15672
- Username: `guest`
- Password: `guest`

---

## User Registration & Login

### Creating a New Account

#### Step 1: Access Registration Page

1. Navigate to http://localhost:5173
2. You'll see the **HomePage** with a beautiful landing interface
3. Click **"Register"** button or **"Get Started"**

#### Step 2: Fill Registration Form

The registration form includes:

```
┌─────────────────────────────────────┐
│     CREATE ACCOUNT                  │
├─────────────────────────────────────┤
│ First Name:    [John         ]     │
│ Last Name:     [Doe          ]     │
│ Email:         [john@example.com]  │
│ Password:      [••••••••••••]      │
│ Confirm Pass:  [••••••••••••]      │
│                                     │
│     [Create Account Button]         │
└─────────────────────────────────────┘
```

**Required Fields:**
- ✅ **First Name** - Your given name
- ✅ **Last Name** - Your family name
- ✅ **Email** - Valid email address (used for login)
- ✅ **Password** - Minimum 8 characters
- ✅ **Confirm Password** - Must match password

**Password Requirements:**
- Minimum 8 characters
- Mix of letters and numbers recommended
- Special characters allowed

#### Step 3: Submit Registration

1. Click **"Create Account"** button
2. System validates your information
3. Account is created in the database
4. Success message appears: "Registration successful! Please login."
5. You're automatically redirected to login page

### Logging In

#### Method 1: OAuth2 Login (Keycloak)

1. Click **"Login"** on the homepage
2. You'll be redirected to Keycloak login page
3. Enter your credentials:
   - **Username/Email**: Your registered email
   - **Password**: Your password
4. Click **"Sign In"**
5. You'll be redirected back to the application

#### Method 2: Direct Login

If already registered:
1. Navigate to http://localhost:5173
2. Click **"Login"** button
3. Use Keycloak authentication
4. Access granted to dashboard

### User Roles

The application supports two roles:

**1. Regular User (Default)**
- Access to personal dashboard
- Log activities
- View recommendations
- Update profile
- View statistics

**2. Admin User**
- All regular user features
- Admin dashboard access
- User management
- System statistics
- Activity monitoring across all users

---

## User Features & How to Use

### 🏠 Dashboard

**URL:** http://localhost:5173/dashboard

The dashboard is your central hub showing:

#### 1. Welcome Section
```
┌──────────────────────────────────────────┐
│  Welcome, [Your Name]                    │
│  Here's your activity snapshot           │
└──────────────────────────────────────────┘
```

#### 2. Quick Add Activity
Fast activity logging widget:
- **Activity Type**: Running, Walking, Cycling
- **Duration**: Minutes spent
- **Calories**: Approximate calories burned

**How to Use:**
1. Select activity type from dropdown
2. Enter duration in minutes
3. Enter estimated calories burned
4. Click **"Add Activity"**
5. Activity is saved immediately

#### 3. Activity Summary Cards

Three key metrics displayed:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   ACTIVITIES │  │   DURATION   │  │   CALORIES   │
│      15      │  │   450 min    │  │    3,250     │
└──────────────┘  └──────────────┘  └──────────────┘
```

- **Total Activities**: Number of logged workouts
- **Total Duration**: Sum of all activity minutes
- **Calories Burned**: Total calories across all activities

#### 4. Activity Chart

Visual representation of your activities:
- **Bar Chart**: Shows activities over time
- **X-Axis**: Dates
- **Y-Axis**: Activity count or duration
- **Interactive**: Hover to see details

#### 5. Health Insights

AI-powered insights based on your activity patterns:
- Activity consistency
- Progress trends
- Health recommendations
- Goal achievement status

#### 6. Achievements

Gamification badges and milestones:
- **First Workout** - Complete your first activity
- **7-Day Streak** - Log activities for 7 consecutive days
- **100 Activities** - Reach 100 total activities
- **Calorie Crusher** - Burn 10,000+ calories
- **Marathon Runner** - Log 1,000+ minutes

### 📊 Activities Page

**URL:** http://localhost:5173/activities

Complete activity management interface:

#### Add New Activity (Detailed Form)

Located at the top of the page:

```
┌───────────────────────────────────────────────────────┐
│  Activity Type    Duration (min)    Calories Burned   │
│  [Running  ▼]     [30          ]    [250          ]   │
│                                                        │
│                            [Add Activity Button]       │
└───────────────────────────────────────────────────────┘
```

**Activity Types Available:**
- 🏃 **Running** - Outdoor or treadmill running
- 🚶 **Walking** - Walking exercise
- 🚴 **Cycling** - Biking or stationary cycling

**Steps:**
1. Select activity type
2. Enter duration in minutes
3. Enter calories burned (estimated)
4. Click **"Add Activity"**
5. Toast notification confirms success
6. Activity appears in list below

#### Activity List

Displays all your logged activities:

```
┌──────────────────────────────────────────────────┐
│  🏃 Running                      Jan 2, 2026      │
│  Duration: 30 min    Calories: 250               │
│  [View Details]                                   │
├──────────────────────────────────────────────────┤
│  🚶 Walking                      Jan 1, 2026      │
│  Duration: 45 min    Calories: 180               │
│  [View Details]                                   │
└──────────────────────────────────────────────────┘
```

**Features:**
- **Chronological Order**: Newest first
- **Activity Icon**: Visual type indicator
- **Date & Time**: When activity was logged
- **Quick Stats**: Duration and calories at a glance
- **View Details**: Click for more information

#### Activity Details

**URL:** http://localhost:5173/activities/:id

Clicking "View Details" shows:
- Complete activity information
- Timestamp
- Additional metrics (if provided)
- Edit option (if enabled)
- Delete option (if enabled)

### 🎯 Recommendations Page

**URL:** http://localhost:5173/recommendations

AI-powered personalized fitness recommendations:

#### How It Works:

1. **Data Collection**: System analyzes your activity history
2. **Pattern Recognition**: AI identifies trends and patterns
3. **Recommendation Generation**: Creates personalized suggestions
4. **Display**: Shows actionable recommendations

#### Types of Recommendations:

**1. Activity Suggestions**
- Best times to work out based on your history
- New activity types to try
- Duration adjustments for optimal results

**2. Progress Insights**
- Areas of improvement
- Consistency feedback
- Goal achievement paths

**3. Health Tips**
- Recovery recommendations
- Variety suggestions
- Intensity adjustments

**4. Motivational Content**
- Milestone celebrations
- Streak achievements
- Personal records

#### Current Status:

```
┌────────────────────────────────────────────┐
│  No recommendations yet.                   │
│  Log some activities to see insights!      │
└────────────────────────────────────────────┘
```

The AI service analyzes your data in the background and generates recommendations as you log more activities.

### 👤 Profile Management

**URL:** http://localhost:5173/profile

#### Profile Overview

Your profile page displays:

```
┌──────────────────────────────────────────────────────┐
│  ┌────┐                                               │
│  │ JD │  John Doe                                     │
│  └────┘  john.doe@example.com                        │
│          Active Member    15 Activities               │
│                                     [Edit Profile]    │
└──────────────────────────────────────────────────────┘
```

**Profile Header:**
- **Avatar**: Initials in gradient circle
- **Full Name**: First + Last name
- **Email**: Registered email address
- **Badges**: Member status and activity count
- **Edit Button**: Update profile information

#### Activity Statistics

Three stat cards show your performance:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 📊 Activities│  │ 📈 Duration  │  │ 🏆 Calories  │
│     15       │  │   450 min    │  │    3,250     │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Editing Your Profile

**URL:** http://localhost:5173/profile/edit

#### Editable Fields:

```
┌─────────────────────────────────────────┐
│  Profile Information                    │
├─────────────────────────────────────────┤
│  First Name:    [John         ]        │
│  Last Name:     [Doe          ]        │
│  Email:         [john@example.com]     │
│                                         │
│  [Cancel]              [Save Changes]  │
└─────────────────────────────────────────┘
```

**Steps to Update:**
1. Click **"Edit Profile"** button
2. Modify fields as needed:
   - First Name
   - Last Name
   - Email
3. Click **"Save Changes"**
4. Confirmation toast appears
5. Profile updates immediately

**Notes:**
- Email must be unique
- Changes sync with Keycloak
- All fields are required

---

## Admin Features & Dashboard

### 🔐 Accessing Admin Panel

**Prerequisites:**
- Must have admin role assigned
- Regular users cannot access admin features

**URL:** http://localhost:5173/admin

### Admin Dashboard Overview

```
┌────────────────────────────────────────────────────┐
│  Admin Dashboard                                   │
│  Manage users, activities, and monitor system     │
└────────────────────────────────────────────────────┘
```

#### System Statistics Cards

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 👥 Total     │  │ 👑 Admin     │  │ 👤 Regular   │
│    Users     │  │    Users     │  │    Users     │
│     125      │  │      5       │  │     120      │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Metrics Displayed:**
- **Total Users**: All registered users in system
- **Admin Users**: Users with admin privileges
- **Regular Users**: Standard user accounts

#### Recent Users Section

Shows the 5 most recently registered users:

```
┌─────────────────────────────────────────────────┐
│  Recent Users                      [View all →] │
├─────────────────────────────────────────────────┤
│  JD  John Doe                    Jan 2, 2026    │
│      john.doe@example.com                       │
├─────────────────────────────────────────────────┤
│  JS  Jane Smith                  Jan 1, 2026    │
│      jane.smith@example.com                     │
└─────────────────────────────────────────────────┘
```

**Information Shown:**
- User initials avatar
- Full name
- Email address
- Registration date

**Actions:**
- Click **"View all"** to see complete user list
- Click individual user for details (future feature)

#### Recent Activities Section

Displays latest activities across all users:

```
┌─────────────────────────────────────────────────┐
│  Recent Activities                 [View all →] │
├─────────────────────────────────────────────────┤
│  🏃 Running by John Doe          Jan 2, 2026    │
│      30 min · 250 cal                           │
├─────────────────────────────────────────────────┤
│  🚶 Walking by Jane Smith        Jan 2, 2026    │
│      45 min · 180 cal                           │
└─────────────────────────────────────────────────┘
```

**Information Shown:**
- Activity type with icon
- User who performed activity
- Duration and calories
- Activity date

### User Management Page

**URL:** http://localhost:5173/admin/users

Complete user management interface for admins:

#### User List Table

```
┌──────────────────────────────────────────────────────────────┐
│  Search: [                                    ] [Filter ▼]   │
├──────────────────────────────────────────────────────────────┤
│  Avatar  Name          Email              Role      Actions  │
├──────────────────────────────────────────────────────────────┤
│   JD     John Doe      john@example.com   User      [Edit]   │
│   JS     Jane Smith    jane@example.com   Admin     [Edit]   │
│   RJ     Robert Jones  robert@example.com User      [Edit]   │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- **Search**: Find users by name or email
- **Filter**: By role (All, Admin, User)
- **Sort**: By name, email, or registration date
- **Pagination**: Browse large user lists

**Admin Actions:**
1. **View User Details**: Click on user row
2. **Edit User**: Modify user information
3. **Change Role**: Promote to admin or demote to user
4. **Deactivate User**: Temporarily disable account (future)
5. **Delete User**: Permanently remove account (with confirmation)

---

## AI Recommendations System

### How the AI Service Works

#### 1. Data Collection Phase

**What Gets Collected:**
- Activity type (Running, Walking, Cycling)
- Duration of each activity
- Calories burned
- Timestamp of activity
- User patterns over time

**Storage:**
- Activities stored in MongoDB
- Indexed by user ID
- Timestamped for pattern analysis

#### 2. Analysis Engine

The AI Service (running on port 8084) performs:

**Pattern Recognition:**
- Identifies workout frequency
- Detects preferred activity types
- Analyzes time-of-day patterns
- Calculates average duration
- Tracks calorie burn rates

**Trend Analysis:**
- Week-over-week comparison
- Progress tracking
- Consistency scoring
- Goal achievement prediction

**Anomaly Detection:**
- Unusual activity gaps
- Overtraining indicators
- Underperformance alerts

#### 3. Recommendation Generation

**Types Generated:**

**A. Activity Recommendations**
```
💡 Based on your history:
   • You workout best between 6-8 AM
   • Try adding cycling to vary your routine
   • Increase running duration by 5 minutes
```

**B. Goal Suggestions**
```
🎯 You're close to:
   • 100 total activities (95/100)
   • 1000 minutes goal (850/1000)
   • 10K calories milestone (9,250/10,000)
```

**C. Health Insights**
```
❤️ Health Tips:
   • Great consistency! 5 workouts this week
   • Consider a rest day after 3 consecutive days
   • Your average calories are improving
```

**D. Motivational Messages**
```
🌟 Keep it up!
   • You've logged activities for 7 days straight
   • Your weekly duration increased by 20%
   • On track to beat last month's record
```

#### 4. Message Queue Integration

**RabbitMQ Messaging:**
```
User Logs Activity → Activity Service
                          ↓
                    Publishes to Queue
                          ↓
                    AI Service Consumes
                          ↓
                    Analyzes & Generates
                          ↓
                    Stores Recommendations
```

**Flow:**
1. User adds activity in frontend
2. Activity Service saves to MongoDB
3. Publishes message to RabbitMQ queue
4. AI Service listens on queue
5. Processes activity data
6. Generates recommendations
7. Stores in database
8. User sees recommendations on next visit

#### 5. Viewing Recommendations

**Frontend Display:**
- Fetches from `/api/ai/recommendations` endpoint
- Updates in real-time
- Categorized by type
- Ranked by relevance

**Refresh Frequency:**
- Regenerated after each activity
- Updated daily for ongoing insights
- Re-analyzed weekly for trends

---

## Profile Management

### Profile Data Structure

Your profile contains:

```javascript
{
  "userId": "unique-id",
  "keycloakId": "keycloak-user-id",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "USER", // or "ADMIN"
  "createdAt": "2026-01-02T10:30:00Z",
  "updatedAt": "2026-01-02T15:45:00Z"
}
```

### Syncing with Keycloak

**Two-Way Sync:**

1. **Update in FitTrack:**
   - Changes made in profile page
   - Sent to User Service (port 8081)
   - Synced to Keycloak via API
   - OAuth token updated

2. **Update in Keycloak:**
   - Admin changes in Keycloak console
   - Token refreshed on next login
   - Profile auto-updates in FitTrack

### Security Features

**Authentication:**
- OAuth2 with PKCE (Proof Key for Code Exchange)
- Secure token storage
- Automatic token refresh
- Logout clears all tokens

**Authorization:**
- Role-based access control (RBAC)
- Admin-only routes protected
- API calls include JWT token
- Backend validates on every request

---

## Frontend Architecture Deep Dive

### Technology Stack

**Core Framework:**
- ⚛️ **React 18** - UI library
- 🔀 **React Router v6** - Navigation
- 🔄 **Redux Toolkit** - State management
- 🎨 **Tailwind CSS** - Styling
- ⚡ **Vite** - Build tool

**Key Libraries:**
- `react-oauth2-code-pkce` - OAuth authentication
- `axios` - HTTP requests
- `react-icons` - Icon components
- `recharts` - Charts and graphs

### Project Structure

```
fitness-app-frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts
│   ├── components/      # Reusable components
│   │   ├── ActivityChart.jsx
│   │   ├── ActivityForm.jsx
│   │   ├── ActivityList.jsx
│   │   ├── ActivitySummary.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Toast.jsx
│   ├── features/        # Feature-specific code
│   │   ├── activities/
│   │   ├── auth/
│   │   ├── profile/
│   │   └── recommendations/
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── HomePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfileUpdatePage.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── AdminUsersPage.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── store/           # Redux store
│   │   └── authSlice.js
│   ├── shared/          # Shared utilities
│   │   └── ui/
│   │       └── SiteLayout.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── authConfig.js    # OAuth configuration
└── package.json
```

### Component Architecture

#### SiteLayout Component

**Purpose:** Wraps all pages with consistent layout

```jsx
<SiteLayout isAuthenticated={true} onLogout={logOut}>
  {/* Page content here */}
</SiteLayout>
```

**Features:**
- Responsive navigation bar
- User menu dropdown
- Footer
- Handles authenticated vs unauthenticated states

#### Routing System

```jsx
<Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/activities" element={<ActivitiesPage />} />
  <Route path="/activities/:id" element={<ActivityDetail />} />
  <Route path="/recommendations" element={<Recommendations />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/profile/edit" element={<ProfileUpdatePage />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/users" element={<AdminUsersPage />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="*" element={<Navigate to="/dashboard" />} />
</Routes>
```

**Protected Routes:**
- Authenticated users: Access to all user routes
- Admin users: Additional access to `/admin/*` routes
- Unauthenticated: Redirected to login

### State Management

#### Redux Store

**authSlice.js:**
```javascript
{
  auth: {
    token: "JWT_TOKEN",
    user: {
      sub: "user-id",
      email: "john@example.com",
      name: "John Doe",
      roles: ["USER"]
    }
  }
}
```

**Actions:**
- `setCredentials(token, user)` - Store auth info
- `logout()` - Clear auth state

#### Context API

**AuthContext (from OAuth library):**
- `token` - Current JWT token
- `tokenData` - Decoded token payload
- `isAuthenticated` - Boolean status
- `logIn()` - Initiate OAuth flow
- `logOut()` - Clear session

### API Service Layer

**services/api.js:**

```javascript
// User Service APIs
registerUser(userData)
getUserProfile(userId)
updateUserProfile(userId, data)

// Activity Service APIs
getActivities()
getActivityById(id)
addActivity(activityData)
getActivityStats()

// Admin Service APIs
getDashboardStats()
getAllUsers()
getAllActivities()

// AI Service APIs (Future)
getRecommendations()
```

**Base Configuration:**
```javascript
const API_BASE_URL = 'http://localhost:8085/api'

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### OAuth2 Authentication Flow

#### 1. Initial Page Load

```
User visits localhost:5173
    ↓
No token found
    ↓
Shows HomePage (Landing page)
```

#### 2. Login Process

```
User clicks "Login"
    ↓
Redirects to Keycloak (localhost:8181)
    ↓
User enters credentials
    ↓
Keycloak validates
    ↓
Redirects back with auth code
    ↓
Frontend exchanges code for token (PKCE)
    ↓
Token stored in localStorage
    ↓
User data decoded from JWT
    ↓
Redux store updated
    ↓
Dashboard accessible
```

#### 3. Token Management

```javascript
// Token stored
localStorage.setItem('ROCP_token', token)

// Token refresh (automatic)
- Checks expiry before requests
- Refreshes if needed
- Transparent to user

// Token validation
- Every API call includes token
- Backend verifies signature
- Returns 401 if invalid
```

### Component Lifecycle

#### Dashboard Page Flow

```
1. Component Mounts
   ↓
2. useEffect runs
   ↓
3. Fetches activities from API
   ↓
4. Updates local state
   ↓
5. Re-renders with data
   ↓
6. Chart components render
   ↓
7. Statistics calculated
   ↓
8. Display updates complete
```

#### Activity Form Submission

```
1. User fills form
   ↓
2. onSubmit handler called
   ↓
3. Form data validated
   ↓
4. API call to addActivity()
   ↓
5. Activity Service receives request
   ↓
6. Saves to MongoDB
   ↓
7. Publishes to RabbitMQ
   ↓
8. Returns success response
   ↓
9. Frontend shows toast
   ↓
10. Activity list refreshes
```

### Styling System

**Tailwind CSS Classes:**

```css
/* Color Scheme */
primary-500: #3B82F6 (Blue)
secondary-500: #8B5CF6 (Purple)
accent-500: #F59E0B (Orange)

/* Background Gradients */
bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900

/* Card Styling */
bg-black/30 backdrop-blur-sm rounded-xl border border-white/5

/* Buttons */
bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2
```

**Responsive Design:**
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
// 1 column mobile
// 2 columns tablet
// 3 columns desktop
```

### Performance Optimizations

**1. Code Splitting:**
```javascript
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
```

**2. Memoization:**
```javascript
const memoizedValue = useMemo(() => 
  calculateExpensiveValue(data), 
  [data]
)
```

**3. Debouncing:**
```javascript
// Search input with debounce
const debouncedSearch = useDebounce(searchTerm, 300)
```

**4. Lazy Loading:**
- Images loaded on scroll
- Routes loaded on demand
- Heavy components split

---

## How Everything Works Together

### End-to-End Flow: Adding an Activity

#### Step 1: User Action (Frontend)
```
User fills activity form
  → type: "Running"
  → duration: 30
  → calories: 250
  → clicks "Add Activity"
```

#### Step 2: Frontend Processing
```javascript
// ActivityForm.jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Prepare data
  const activityData = {
    type: activity.type,
    duration: Number(activity.duration),
    caloriesBurned: Number(activity.caloriesBurned)
  }
  
  // Call API
  await addActivity(activityData)
}
```

#### Step 3: API Service Layer
```javascript
// services/api.js
export const addActivity = async (activity) => {
  const response = await axios.post(
    `${API_BASE_URL}/activities`,
    activity,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
  return response
}
```

#### Step 4: API Gateway (Port 8085)
```
Request received at localhost:8085/api/activities
  ↓
Validates JWT token
  ↓
Checks Eureka for Activity Service location
  ↓
Routes to Activity Service (localhost:8082)
```

#### Step 5: Activity Service (Port 8082)
```java
@PostMapping("/activities")
public ResponseEntity<?> addActivity(@RequestBody Activity activity) {
    // Extract user ID from JWT
    String userId = extractUserId();
    activity.setUserId(userId);
    
    // Save to MongoDB
    Activity saved = activityRepository.save(activity);
    
    // Publish to RabbitMQ
    rabbitTemplate.convertAndSend(
        "activity-exchange",
        "activity.created",
        saved
    );
    
    return ResponseEntity.ok(saved);
}
```

#### Step 6: MongoDB Storage
```
Activity document created:
{
  "_id": "activity-12345",
  "userId": "user-67890",
  "type": "RUNNING",
  "duration": 30,
  "caloriesBurned": 250,
  "timestamp": "2026-01-02T15:30:00Z"
}
```

#### Step 7: RabbitMQ Message
```
Message published to queue:
Exchange: "activity-exchange"
Routing Key: "activity.created"
Payload: {activityId, userId, type, duration, calories}
```

#### Step 8: AI Service Processing (Port 8084)
```java
@RabbitListener(queues = "activity-queue")
public void processActivity(ActivityMessage message) {
    // Fetch user's activity history
    List<Activity> history = getActivityHistory(message.getUserId());
    
    // Analyze patterns
    ActivityPattern pattern = analyzePattern(history);
    
    // Generate recommendations
    List<Recommendation> recs = generateRecommendations(pattern);
    
    // Save recommendations
    recommendationRepository.saveAll(recs);
}
```

#### Step 9: Frontend Update
```javascript
// Toast notification
setToast({ 
  type: 'success', 
  message: 'Activity added successfully!' 
})

// Refresh activity list
onActivityAdded()

// Dashboard auto-updates
useEffect(() => {
  fetchActivities()
}, [])
```

### Complete System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│              http://localhost:5173                          │
│         (React + Redux + OAuth2 PKCE)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY                               │
│              http://localhost:8085                          │
│         (Routes, Auth, Load Balancing)                      │
└─────┬──────────┬────────┬────────┬────────┬────────────────┘
      │          │        │        │        │
      ↓          ↓        ↓        ↓        ↓
┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Config   │ │Eureka  │ │  User  │ │Activity│ │   AI   │
│ Server   │ │Registry│ │Service │ │Service │ │Service │
│  :8888   │ │ :8761  │ │ :8081  │ │ :8082  │ │ :8084  │
└──────────┘ └────────┘ └────┬───┘ └───┬────┘ └───┬────┘
                             │         │          │
                    ┌────────┴─────────┴──────────┴────────┐
                    │                                       │
              ┌─────▼─────┐  ┌──────▼──────┐  ┌───▼──────┐
              │   MySQL   │  │   MongoDB   │  │ RabbitMQ │
              │   :3307   │  │   :27017    │  │  :5672   │
              └───────────┘  └─────────────┘  └──────────┘
```

### Data Flow Visualization

```
USER REGISTRATION:
Frontend → Gateway → User Service → MySQL → Keycloak
                                       ↓
                                  User Created
                                       ↓
                                 Token Generated
                                       ↓
                                  Return to UI

ACTIVITY LOGGING:
Frontend → Gateway → Activity Service → MongoDB
                            ↓
                      RabbitMQ Queue
                            ↓
                       AI Service
                            ↓
                   Generate Recommendations
                            ↓
                       Store in MongoDB

RECOMMENDATIONS VIEW:
Frontend → Gateway → AI Service → MongoDB
                                     ↓
                              Fetch Recommendations
                                     ↓
                                Return to UI
                                     ↓
                               Display to User
```

---

## Troubleshooting

### Common Issues

#### 1. Cannot Access Application

**Problem:** http://localhost:5173 not loading

**Solutions:**
```bash
# Check if frontend is running
# Look for terminal window titled "Frontend"

# Restart frontend
cd fitness-app-frontend
npm run dev

# Check for port conflicts
netstat -ano | findstr :5173
```

#### 2. Login Fails

**Problem:** Keycloak login page doesn't appear

**Solutions:**
- Check Keycloak is running: http://localhost:8181
- Verify docker-compose shows Keycloak as healthy
- Clear browser cache and cookies
- Check `authConfig.js` settings

#### 3. Activities Not Saving

**Problem:** "Add Activity" shows error

**Checks:**
```bash
# Verify Activity Service is running
curl http://localhost:8082/actuator/health

# Check MongoDB connection
docker exec fitness-mongodb mongosh --eval "db.adminCommand('ping')"

# View Activity Service logs
# Check terminal window "ActivityService"
```

#### 4. No Recommendations Appearing

**Problem:** Recommendations page is empty

**Reasons:**
- AI Service needs more data (minimum 5 activities)
- RabbitMQ queue not processing
- AI Service not running

**Solutions:**
```bash
# Check AI Service
curl http://localhost:8084/actuator/health

# Check RabbitMQ queues
# Visit http://localhost:15672
# Login: guest/guest
# Check "Queues" tab

# Verify messages are being consumed
```

#### 5. Admin Panel Not Accessible

**Problem:** Admin dashboard shows 403 Forbidden

**Solutions:**
- Verify your user has admin role
- Check Keycloak user roles:
  1. Go to http://localhost:8181
  2. Login as admin
  3. Select realm
  4. Find your user
  5. Assign "admin" role

#### 6. Profile Updates Not Saving

**Problem:** Profile changes don't persist

**Solutions:**
- Check User Service logs
- Verify MySQL connection
- Check JWT token validity
- Try logging out and back in

### Service Health Checks

```bash
# Check all Docker services
docker-compose ps

# Check all Spring Boot services
curl http://localhost:8761  # Eureka - should show registered services

# Individual health checks
curl http://localhost:8888/actuator/health  # Config Server
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:8082/actuator/health  # Activity Service
curl http://localhost:8084/actuator/health  # AI Service
curl http://localhost:8085/actuator/health  # Gateway
```

### Browser Console Debugging

Press `F12` to open developer tools:

**Check for Errors:**
- Console tab: JavaScript errors
- Network tab: Failed API calls
- Application tab: Token storage

**Common Console Messages:**
```javascript
// Good
"Token received and stored"
"Activity added successfully"

// Bad
"Network Error" → Check backend is running
"401 Unauthorized" → Token expired, re-login
"404 Not Found" → Service not available
```

---

## Quick Reference

### User Journey Flowchart

```
START
  ↓
Register Account → Verify Email → Login with OAuth2
  ↓
Dashboard → View Statistics & Charts
  ↓
Add Activities → View Activity History
  ↓
Check Recommendations → AI Insights
  ↓
Update Profile → Save Changes
  ↓
[Admin Only] → Admin Dashboard → Manage Users
```

### Feature Checklist

**As a User, I can:**
- ✅ Register a new account
- ✅ Login with OAuth2
- ✅ View my dashboard
- ✅ Log activities (Running, Walking, Cycling)
- ✅ See activity statistics
- ✅ View activity history
- ✅ Get AI recommendations
- ✅ Update my profile
- ✅ View achievements
- ✅ See activity charts

**As an Admin, I can:**
- ✅ Access admin dashboard
- ✅ View system statistics
- ✅ See all users
- ✅ View all activities
- ✅ Manage user roles (future)
- ✅ Monitor system health

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Quick search (future) |
| `Ctrl + N` | New activity (future) |
| `Ctrl + P` | View profile |
| `Esc` | Close modals |
| `Tab` | Navigate form fields |

---

## Support & Resources

### Getting Help

**Documentation:**
- [Quick Start Guide](QUICK_START.md)
- [Development Guide](DEVELOPMENT_GUIDE.md)
- [Docker Guide](DOCKER_GUIDE.md)
- [API Documentation](API-DOCUMENTATION.md)

**Community:**
- GitHub Issues: Report bugs
- Discussions: Ask questions
- Wiki: Additional guides

### API Endpoints

**User Service (8081):**
- `POST /api/users/register` - Register new user
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update user profile

**Activity Service (8082):**
- `GET /api/activities` - List activities
- `POST /api/activities` - Add activity
- `GET /api/activities/{id}` - Get activity details
- `GET /api/activities/stats` - Get statistics

**Admin Service (8083):**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/activities` - All activities

**AI Service (8084):**
- `GET /api/ai/recommendations` - Get recommendations
- `POST /api/ai/analyze` - Trigger analysis

---

## Summary

🎯 **FitTrack** is a comprehensive fitness tracking application with:
- 🔐 Secure OAuth2 authentication via Keycloak
- 📊 Activity logging and statistics
- 🤖 AI-powered recommendations
- 👤 User profile management
- 👑 Admin dashboard for system management
- 📱 Responsive, modern UI
- 🏗️ Microservices architecture
- ☁️ Cloud-ready with Docker

**Start tracking your fitness journey today! 🚀**

---

*Last Updated: January 2, 2026*
*Version: 1.0.0*
