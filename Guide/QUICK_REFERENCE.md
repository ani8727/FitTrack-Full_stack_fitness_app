# FitTrack Quick Reference Card

## 🚀 Quick Start

### Start All Services:
```bash
cd c:\Users\anike\Desktop\Project\fitness_app
start-all.bat
```

### Access Points:
- **Frontend**: http://localhost:5173
- **Keycloak**: http://localhost:8181
- **Eureka**: http://localhost:8761
- **API Gateway**: http://localhost:8085
- **RabbitMQ**: http://localhost:15672
- **User Service**: http://localhost:8081
- **Activity Service**: http://localhost:8082
- **Admin Service**: http://localhost:8083
- **AI Service**: http://localhost:8084

---

## 📋 New Features Implemented

### ✅ Account Management
- **Deactivate Account**: Temporary, reversible
- **Delete Account**: Permanent, password required
- **Reactivate Account**: Restore deactivated account

### ✅ Onboarding Wizard
- **4 Steps**: Basic Info → Physical Stats → Fitness Goals → Complete
- **Auto-shows**: After first login
- **One-time**: Never shown again after completion

### ✅ Extended Profile
- **15+ Fields**: Gender, age, height, weight, goals, weaknesses, health issues, etc.
- **AI-Powered**: Used for personalized recommendations

### ✅ Daily Plans
- **AI-Generated**: Personalized workout schedules
- **Date-based**: Generate for any date
- **Comprehensive**: Morning, afternoon, evening routines + nutrition

---

## 🔗 API Endpoints (New)

### Account Management
```
POST   /api/users/{userId}/deactivate    # Deactivate account
DELETE /api/users/{userId}/delete        # Delete account
POST   /api/users/{userId}/reactivate    # Reactivate account
POST   /api/users/{userId}/onboarding/complete  # Complete onboarding
GET    /api/users/{userId}/onboarding/status    # Check onboarding status
```

### User Profile
```
PUT    /api/users/{userId}/profile       # Update extended profile
```

### Daily Plans
```
POST   /api/daily-plans                  # Generate daily plan
GET    /api/daily-plans/user/{userId}    # Get user's plans
```

### AI Recommendations
```
POST   /api/activities/recommend         # Get personalized recommendation
```

---

## 🗄️ Database Schema Updates

### MySQL (userdb.users table)
```sql
ALTER TABLE users ADD COLUMN account_status VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN deactivated_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN deactivation_reason TEXT NULL;

-- Extended profile fields (already added)
-- gender, age, height, weight, place, fitness_goals, weaknesses, 
-- health_issues, daily_plan_preference, activity_level, weekly_activity_target
```

### MongoDB Collections
```javascript
// dailyPlans collection
{
  userId: "string",
  date: "2026-01-02",
  morning: { exercises: [...], duration: 30 },
  afternoon: { exercises: [...], duration: 45 },
  evening: { exercises: [...], duration: 20 },
  nutrition: "...",
  hydration: "...",
  createdAt: ISODate(...)
}

// recommendations collection
{
  userId: "string",
  recommendation: "...",
  createdAt: ISODate(...)
}

// activities collection (existing)
```

---

## 🎯 Testing Quick Commands

### Check if services are running:
```bash
# Check Java services
netstat -ano | findstr :8081    # User Service
netstat -ano | findstr :8082    # Activity Service
netstat -ano | findstr :8085    # API Gateway

# Check databases
netstat -ano | findstr :3307    # MySQL
netstat -ano | findstr :27017   # MongoDB
```

### Database Quick Checks:
```sql
-- MySQL
USE userdb;

-- View latest users
SELECT id, username, email, account_status, onboarding_completed, created_at 
FROM users 
ORDER BY created_at DESC LIMIT 10;

-- Count by status
SELECT account_status, COUNT(*) as count 
FROM users 
GROUP BY account_status;

-- Find users who completed onboarding
SELECT username, email, onboarding_completed 
FROM users 
WHERE onboarding_completed = true;
```

```javascript
// MongoDB
use activitydb;

// View latest daily plans
db.dailyPlans.find().sort({createdAt: -1}).limit(5).pretty();

// Count plans per user
db.dailyPlans.aggregate([
  { $group: { _id: "$userId", count: { $sum: 1 } } }
]);

// View latest recommendations
db.recommendations.find().sort({createdAt: -1}).limit(5).pretty();
```

---

## 📱 Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page |
| `/login` | LoginPage | User login |
| `/register` | RegisterPage | User registration |
| `/dashboard` | Dashboard | Main dashboard |
| `/activities` | ActivitiesPage | Activity tracking |
| `/recommendations` | RecommendationsPage | AI suggestions |
| `/daily-plan` | DailyPlanPage | Daily workout plans |
| `/profile` | ProfileUpdatePage | Edit profile |
| `/settings/account` | AccountSettingsPage | Account management |
| (automatic) | OnboardingWizard | First-time setup |

---

## 🔐 Account Status Flow

```
INACTIVE → (verify email) → ACTIVE → (user deactivates) → DEACTIVATED
                                   ↓
                          (user deletes) → DELETED
                                   ↓
                         (admin suspends) → SUSPENDED
                                   ↓
                            (admin bans) → BANNED
                            
DEACTIVATED → (reactivate) → ACTIVE
```

---

## 🎨 UI Components

### Onboarding Wizard Steps:
1. **Basic Info**: Gender, Age
2. **Physical Stats**: Height, Weight
3. **Fitness Goals**: Activity level, goals, targets
4. **Completion**: Success message + redirect

### Account Settings Page:
- **Account Information**: Email, username, ID
- **Danger Zone**:
  - Deactivate (yellow card, reversible)
  - Delete (red card, permanent)

### Daily Plan Page:
- Date picker
- Generate button
- Morning/Afternoon/Evening workout sections
- Nutrition recommendations
- Hydration goals

---

## 🔧 Troubleshooting

### Service won't start:
```bash
# Check if port is already in use
netstat -ano | findstr :PORT_NUMBER

# Kill process if needed
taskkill /PID process_id /F

# Rebuild service
cd service_directory
mvn clean package -DskipTests
```

### Onboarding not showing:
```javascript
// In App.jsx, enable onboarding check:
const checkOnboarding = async () => {
    // ... existing code ...
    setNeedsOnboarding(true);  // Uncomment this line
};
```

### Database connection issues:
```bash
# Verify MySQL is running
mysql -u root -p -h localhost -P 3307

# Verify MongoDB is running
mongo --port 27017
```

### Frontend not connecting to backend:
```javascript
// Check api.js baseURL
const baseURL = 'http://localhost:8085/api';

// Check CORS configuration in gateway
# Should allow http://localhost:5173
```

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `ACCOUNT_MANAGEMENT_GUIDE.md` | Complete account features guide |
| `TESTING_CHECKLIST.md` | Comprehensive testing checklist |
| `ADMIN_FEATURES_RECOMMENDATIONS.md` | Admin features & future plans |
| `ENHANCED_FEATURES_GUIDE.md` | Extended profiles & AI features |
| `COMPLETE_STARTUP_GUIDE.md` | Full system setup guide |
| `USER_APPLICATION_GUIDE.md` | User manual |
| `DOCKER_GUIDE.md` | Docker & containerization guide |

---

## 🎯 What to Test First

### Priority 1 (Critical):
1. ✅ User registration
2. ✅ User login
3. ✅ Onboarding wizard (all 4 steps)
4. ✅ Profile update
5. ✅ Account deactivation (with password)
6. ✅ Account deletion (with password)

### Priority 2 (Important):
1. ✅ Daily plan generation
2. ✅ AI recommendations
3. ✅ Activity logging
4. ✅ Navigation (all menu items)
5. ✅ Settings page

### Priority 3 (Nice to have):
1. ✅ Responsive design (mobile, tablet, desktop)
2. ✅ Error handling
3. ✅ Loading states
4. ✅ Toast notifications

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot login after deactivation"
**Fix**: This is expected behavior. Either:
- Run SQL to reactivate: `UPDATE users SET account_status='ACTIVE' WHERE email='user@email.com';`
- Implement auto-reactivation on login attempt

### Issue: "Onboarding wizard not appearing"
**Fix**: Check database `onboarding_completed` field. Set to `false` to show wizard again.

### Issue: "Password verification fails on deletion"
**Fix**: Ensure passwords are properly encoded with BCrypt. Check if `passwordEncoder.matches()` is used.

### Issue: "Daily plan generation fails"
**Fix**: 
- Verify MongoDB is running
- Check AI service has valid Gemini API key
- Review AI service logs for errors

### Issue: "404 on API calls"
**Fix**:
- Verify API Gateway is running on port 8085
- Check service registration in Eureka
- Verify route configuration in gateway

---

## 💡 Tips & Best Practices

### Development:
- Always rebuild after backend changes: `mvn clean package`
- Use `mvn clean package -DskipTests` to skip tests for faster builds
- Clear browser cache if frontend changes don't appear
- Check browser console for JavaScript errors
- Check network tab for API call failures

### Testing:
- Test with real user flows (registration → onboarding → usage)
- Test error scenarios (wrong password, network errors)
- Test on different browsers
- Test responsive design

### Security:
- Never commit API keys to Git
- Always use environment variables for secrets
- Verify password before destructive operations
- Use HTTPS in production
- Keep dependencies updated

---

## 🎉 You're All Set!

Your FitTrack application now includes:
- ✅ Complete user registration & authentication
- ✅ 4-step onboarding wizard for new users
- ✅ Extended user profiles (15+ fields)
- ✅ AI-powered daily workout plans
- ✅ Personalized activity recommendations
- ✅ Account management (deactivate/delete/reactivate)
- ✅ Settings page with danger zone
- ✅ Password-protected sensitive operations
- ✅ Comprehensive navigation
- ✅ Beautiful, responsive UI

### Next Steps:
1. Run `start-all.bat` to start all services
2. Run SQL schema updates (see DATABASE SCHEMA UPDATES above)
3. Open http://localhost:5173
4. Register a new user
5. Complete the onboarding wizard
6. Explore all features!

### For Help:
- See `TESTING_CHECKLIST.md` for detailed testing guide
- See `ACCOUNT_MANAGEMENT_GUIDE.md` for feature documentation
- See `ADMIN_FEATURES_RECOMMENDATIONS.md` for future enhancements
- Check service logs for backend errors
- Check browser console for frontend errors

**Good luck! 🚀💪**
