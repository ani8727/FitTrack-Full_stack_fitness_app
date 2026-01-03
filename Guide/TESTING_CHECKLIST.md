# FitTrack Testing & Verification Checklist

## Pre-Testing Setup

### 1. Database Preparation
- [ ] MySQL running on port 3307
- [ ] MongoDB running on port 27017
- [ ] Run schema updates:
```sql
USE userdb;

ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deactivation_reason TEXT NULL;
```

### 2. Services Startup Order
1. [ ] MySQL (port 3307)
2. [ ] MongoDB (port 27017)
3. [ ] RabbitMQ (ports 5672, 15672)
4. [ ] Keycloak (port 8181)
5. [ ] Config Server (port 8888)
6. [ ] Eureka Server (port 8761)
7. [ ] User Service (port 8081)
8. [ ] Activity Service (port 8082)
9. [ ] Admin Service (port 8083)
10. [ ] AI Service (port 8084)
11. [ ] API Gateway (port 8085)
12. [ ] Frontend (port 5173)

**Quick Start:**
```bash
cd c:\Users\anike\Desktop\Project\fitness_app
start-all.bat
```

---

## Feature Testing Plan

### 🔐 A. User Registration & Login
- [ ] Register new user
  - Navigate to http://localhost:5173
  - Click "Register" or "Sign Up"
  - Fill form: username, email, password
  - Submit and verify success message
  
- [ ] Login with new account
  - Enter credentials
  - Verify redirect to onboarding wizard
  
- [ ] Check database:
  ```sql
  SELECT id, username, email, account_status, onboarding_completed 
  FROM users 
  ORDER BY created_at DESC LIMIT 1;
  ```
  Expected: `account_status='ACTIVE'`, `onboarding_completed=false`

---

### 🎯 B. Onboarding Wizard

#### Step 1: Basic Info
- [ ] Wizard loads automatically after login
- [ ] See "Welcome to FitTrack!" heading
- [ ] Step 1 active (blue indicator)
- [ ] Form fields visible:
  - [ ] Gender dropdown (Male, Female, Other, Prefer not to say)
  - [ ] Age input (number)
- [ ] Try clicking "Next" with empty fields → should be disabled
- [ ] Fill both fields → "Next" becomes enabled
- [ ] Click "Next" → advances to Step 2

#### Step 2: Physical Stats
- [ ] Step 2 indicator active
- [ ] Previous step shows checkmark
- [ ] Form fields visible:
  - [ ] Height (cm)
  - [ ] Weight (kg)
- [ ] "Back" button returns to Step 1
- [ ] Fill both fields
- [ ] Click "Next" → advances to Step 3

#### Step 3: Fitness Goals
- [ ] Step 3 indicator active
- [ ] Form fields visible:
  - [ ] Activity Level dropdown (Sedentary, Lightly Active, etc.)
  - [ ] Fitness Goals textarea
  - [ ] Weaknesses textarea
  - [ ] Health Issues textarea
  - [ ] Daily Plan Preference textarea
  - [ ] Weekly Activity Target (hours)
- [ ] Fill required fields (activity level, goals, target)
- [ ] Click "Next" → advances to Step 4

#### Step 4: Completion
- [ ] Success message displayed
- [ ] "What's next?" section visible
- [ ] Shows 4 suggestions (activities, recommendations, etc.)
- [ ] Toast notification appears
- [ ] After 2 seconds → redirects to dashboard
- [ ] Verify database:
  ```sql
  SELECT onboarding_completed FROM users WHERE email = 'your_email';
  ```
  Expected: `onboarding_completed=true`

---

### 📊 C. Dashboard & Navigation

- [ ] Dashboard loads successfully
- [ ] Sidebar visible with menu items:
  - [ ] Dashboard (home icon)
  - [ ] Activities (activity icon)
  - [ ] Recommendations (brain icon)
  - [ ] Daily Plan (calendar icon)
  - [ ] Profile (user icon)
  - [ ] Settings (settings icon)
- [ ] Click each menu item → verifies navigation works
- [ ] No console errors

---

### 👤 D. Extended Profile Features

#### View Profile
- [ ] Navigate to Profile page
- [ ] See all extended fields:
  - Basic: Username, Email
  - Physical: Gender, Age, Height, Weight
  - Goals: Activity Level, Fitness Goals, Weaknesses
  - Health: Health Issues, Daily Plan Preference
  - Target: Weekly Activity Target

#### Update Profile
- [ ] Click "Edit Profile" or similar button
- [ ] Form loads with current values
- [ ] Update any field (e.g., change weight)
- [ ] Click "Save" or "Update"
- [ ] Success toast appears
- [ ] Verify database updated:
  ```sql
  SELECT * FROM users WHERE email = 'your_email';
  ```

---

### 📅 E. Daily Plan Generation

- [ ] Navigate to "Daily Plan" from sidebar
- [ ] Page loads with date picker
- [ ] Click "Generate Daily Plan" button
- [ ] Loading indicator appears
- [ ] After 3-5 seconds → plan displays
- [ ] Verify sections present:
  - Morning Workout
  - Afternoon Activity
  - Evening Routine
- [ ] Each workout shows:
  - Exercise name
  - Duration
  - Instructions
- [ ] Nutrition recommendations visible
- [ ] Hydration goals shown
- [ ] Check MongoDB:
  ```javascript
  db.dailyPlans.find().sort({createdAt: -1}).limit(1).pretty()
  ```

#### Test Different Dates
- [ ] Select tomorrow's date
- [ ] Generate new plan
- [ ] Verify different content generated
- [ ] Select past date
- [ ] Generate plan
- [ ] Can view historical plans

---

### 🤖 F. AI Recommendations

- [ ] Navigate to "Recommendations" page
- [ ] Click "Get AI Recommendation"
- [ ] Loading state shows
- [ ] Recommendation appears with:
  - Title
  - Description/advice
  - Personalized to your profile
- [ ] Check if mentions your goals/weaknesses
- [ ] Check MongoDB:
  ```javascript
  db.recommendations.find({userId: "your_user_id"}).pretty()
  ```

---

### ⚙️ G. Account Settings - Deactivation

#### Navigate to Settings
- [ ] Click "Settings" in sidebar
- [ ] Account Settings page loads
- [ ] See account information:
  - Email
  - Username
  - Account ID

#### Attempt Deactivation
- [ ] Scroll to "Danger Zone"
- [ ] See yellow warning card "Deactivate Account"
- [ ] Click "Deactivate Account" button
- [ ] Modal opens with:
  - Warning message
  - Optional reason field
  - Password input
  - "Cancel" and "Deactivate" buttons

#### Test Validation
- [ ] Try clicking "Deactivate" without password → should show error
- [ ] Enter wrong password → should show error
- [ ] Enter correct password
- [ ] Click "Deactivate"
- [ ] Loading state appears
- [ ] Success toast shows
- [ ] Automatically logged out

#### Verify Deactivation
- [ ] Check database:
  ```sql
  SELECT account_status, deactivated_at, deactivation_reason 
  FROM users 
  WHERE email = 'your_email';
  ```
  Expected: `account_status='DEACTIVATED'`, `deactivated_at` has timestamp

#### Test Login After Deactivation
- [ ] Try to login
- [ ] Should be blocked (account deactivated)
- [ ] OR automatically reactivate and allow login (based on business logic)

---

### 🗑️ H. Account Settings - Deletion

#### Reactivate First (if deactivated)
- [ ] If needed, run SQL:
  ```sql
  UPDATE users 
  SET account_status = 'ACTIVE', deactivated_at = NULL 
  WHERE email = 'your_email';
  ```
- [ ] Login again

#### Navigate to Deletion
- [ ] Go to Settings → Account
- [ ] Scroll to "Danger Zone"
- [ ] See red warning card "Delete Account"
- [ ] Click "Delete Account" button

#### Review Warning Modal
- [ ] Modal opens with:
  - **RED theme** (more severe than deactivate)
  - Strong warning message
  - "This action cannot be undone"
  - Optional feedback field
  - Password input (required)
  - "Cancel" and "Delete Forever" buttons

#### Test Deletion Process
- [ ] Try clicking "Delete Forever" without password → error
- [ ] Enter correct password
- [ ] Optionally enter feedback
- [ ] Click "Delete Forever"
- [ ] Loading state shows
- [ ] Success message appears
- [ ] Automatically logged out
- [ ] Redirected to login/home page

#### Verify Deletion
- [ ] Check database:
  ```sql
  SELECT account_status, deactivated_at, deactivation_reason 
  FROM users 
  WHERE email = 'your_email';
  ```
  Expected: `account_status='DELETED'`, timestamps set

#### Test Login After Deletion
- [ ] Try to login with deleted account
- [ ] Should be blocked (account deleted)
- [ ] Error message shown

---

### 🔧 I. API Endpoint Testing

#### Deactivate Account
```bash
curl -X POST http://localhost:8085/api/users/{userId}/deactivate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "your_password",
    "reason": "Taking a break for a month"
  }'
```
Expected Response: `"Account deactivated successfully"`

#### Delete Account
```bash
curl -X DELETE http://localhost:8085/api/users/{userId}/delete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "your_password",
    "reason": "No longer need the app"
  }'
```
Expected Response: `"Account marked for deletion"`

#### Reactivate Account
```bash
curl -X POST http://localhost:8085/api/users/{userId}/reactivate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
Expected Response: `"Account reactivated successfully"`

#### Complete Onboarding
```bash
curl -X POST http://localhost:8085/api/users/{userId}/onboarding/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
Expected Response: `"Onboarding completed"`

#### Get Onboarding Status
```bash
curl -X GET http://localhost:8085/api/users/{userId}/onboarding/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
Expected Response: `true` or `false`

---

### 📱 J. Responsive Design Testing

#### Desktop (1920x1080)
- [ ] Sidebar fully visible
- [ ] Forms have good spacing
- [ ] Modals centered properly
- [ ] Wizard steps display horizontally

#### Tablet (768x1024)
- [ ] Sidebar still accessible
- [ ] Forms adapt to screen width
- [ ] Modals still readable
- [ ] Wizard steps responsive

#### Mobile (375x667)
- [ ] Sidebar collapsible or hamburger menu
- [ ] Forms stack vertically
- [ ] Modals take full width
- [ ] Wizard steps stack vertically
- [ ] Touch targets large enough

---

### 🎨 K. UI/UX Verification

#### Onboarding Wizard
- [ ] Smooth transitions between steps
- [ ] Progress bar animates correctly
- [ ] Icons visible and appropriate
- [ ] Colors consistent (blue theme)
- [ ] Gradient background looks good
- [ ] Success messages clear
- [ ] Loading states intuitive

#### Account Settings
- [ ] Danger zone visually separated
- [ ] Yellow warning for deactivate
- [ ] Red warning for delete
- [ ] Icons communicate severity
- [ ] Modals have backdrop blur
- [ ] Confirmation buttons color-coded
- [ ] Password fields masked
- [ ] Error messages clear

#### General UI
- [ ] Consistent typography
- [ ] Icons from Feather Icons
- [ ] Tailwind CSS styling consistent
- [ ] No layout shifts
- [ ] Smooth scrolling
- [ ] Toast notifications positioned correctly

---

### 🔍 L. Error Handling

#### Network Errors
- [ ] Disconnect internet
- [ ] Try generating daily plan
- [ ] Verify error message shown
- [ ] Reconnect internet
- [ ] Retry → should work

#### Invalid Data
- [ ] Enter negative age in onboarding
- [ ] Try to proceed → validation error
- [ ] Enter 0 for weekly target
- [ ] Validation prevents submission

#### Authentication Errors
- [ ] Logout
- [ ] Try accessing protected route directly
- [ ] Should redirect to login

#### Server Errors
- [ ] Stop user service
- [ ] Try updating profile
- [ ] Error message shown
- [ ] Restart service
- [ ] Retry → works

---

### 🔐 M. Security Testing

#### Password Verification
- [ ] Try deactivating with wrong password → blocked
- [ ] Try deleting with wrong password → blocked
- [ ] Passwords not visible in network tab
- [ ] Passwords properly encoded in transit

#### Token Management
- [ ] Token stored securely (httpOnly if possible)
- [ ] Expired token → logout
- [ ] Fresh token on login
- [ ] Token included in all auth requests

#### Account Status Checks
- [ ] Deactivated account can't login
- [ ] Deleted account can't login
- [ ] Active account can access all features

---

### 📊 N. Database Integrity

#### Check Data Consistency
```sql
-- View all users with account status
SELECT id, username, email, account_status, onboarding_completed, 
       created_at, last_login_at, deactivated_at
FROM users
ORDER BY created_at DESC;

-- Count by status
SELECT account_status, COUNT(*) as count
FROM users
GROUP BY account_status;

-- Find incomplete onboarding
SELECT id, username, onboarding_completed
FROM users
WHERE onboarding_completed = false;

-- Find deleted accounts
SELECT id, username, email, account_status, deactivation_reason
FROM users
WHERE account_status = 'DELETED';
```

#### MongoDB Verification
```javascript
// Count daily plans per user
db.dailyPlans.aggregate([
  { $group: { _id: "$userId", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Find AI recommendations
db.recommendations.find().sort({createdAt: -1}).limit(5).pretty()

// Check activities
db.activities.find().sort({date: -1}).limit(5).pretty()
```

---

### ✅ O. Browser Compatibility

- [ ] Chrome/Edge (latest)
  - All features work
  - No console errors
  - UI renders correctly

- [ ] Firefox (latest)
  - All features work
  - No console errors
  - UI renders correctly

- [ ] Safari (if available)
  - All features work
  - No console errors
  - UI renders correctly

---

### 🚀 P. Performance Testing

#### Page Load Times
- [ ] Homepage loads < 2 seconds
- [ ] Dashboard loads < 3 seconds
- [ ] Daily plan generation < 5 seconds
- [ ] Profile update saves < 1 second

#### API Response Times
- [ ] User profile fetch < 500ms
- [ ] Activity list < 1 second
- [ ] AI recommendation < 3 seconds
- [ ] Onboarding completion < 500ms

#### Frontend Performance
- [ ] No memory leaks (check DevTools)
- [ ] Smooth animations (60fps)
- [ ] No layout thrashing
- [ ] Images optimized

---

### 📝 Q. Console & Logs

#### Frontend Console
- [ ] No errors during normal use
- [ ] No warnings about deprecated APIs
- [ ] Network requests successful (status 200/201)
- [ ] Redux DevTools shows state updates

#### Backend Logs
- [ ] User service logs:
  - Account deactivation logged
  - Account deletion logged
  - Onboarding completion logged
  - Password verification attempts logged

- [ ] Check logs:
  ```bash
  # Windows
  type c:\Users\anike\Desktop\Project\fitness_app\userservice\logs\application.log

  # Or check console output
  ```

---

### 🎯 R. Business Logic Verification

#### Onboarding Flow
- [ ] New users must complete onboarding
- [ ] Onboarding wizard shown only once
- [ ] Profile data saved correctly
- [ ] After completion → never shown again

#### Account Lifecycle
- [ ] ACTIVE → can use all features
- [ ] DEACTIVATED → cannot login (or auto-reactivate)
- [ ] DELETED → cannot login, data marked for removal
- [ ] REACTIVATED → can use all features again

#### Data Personalization
- [ ] AI recommendations use profile data
- [ ] Daily plans consider:
  - Age and fitness level
  - Goals and weaknesses
  - Health issues
  - Activity preferences
- [ ] Recommendations improve with more data

---

### 📋 S. Final Checklist

#### Documentation
- [ ] All new features documented
- [ ] API endpoints listed
- [ ] Database schema updated
- [ ] User guide available
- [ ] Developer guide updated

#### Code Quality
- [ ] No compilation errors
- [ ] No runtime exceptions
- [ ] Proper error handling
- [ ] Logging implemented
- [ ] Code commented where needed

#### Security
- [ ] Passwords verified before deletion
- [ ] Sensitive data encrypted
- [ ] SQL injection prevented (using JPA)
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled

#### User Experience
- [ ] Intuitive navigation
- [ ] Clear instructions
- [ ] Helpful error messages
- [ ] Confirmation for destructive actions
- [ ] Success feedback provided

---

## Bug Reporting Template

If you find any issues, document them as follows:

```
**Bug Title:** [Short description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[If applicable]

**Console Errors:**
```
[Paste errors]
```

**Environment:**
- Browser: 
- OS: 
- Date/Time: 
- User: 

**Additional Notes:**
[Any other relevant information]
```

---

## Success Criteria

All features are considered working when:

✅ **Registration & Login**
- [x] New users can register
- [x] Users can login with correct credentials
- [x] Invalid credentials rejected

✅ **Onboarding**
- [x] Wizard appears for new users
- [x] All 4 steps can be completed
- [x] Data saved to database
- [x] Marked as completed after finishing

✅ **Profile Management**
- [x] View extended profile
- [x] Update all fields
- [x] Changes persisted to database
- [x] AI uses profile data for personalization

✅ **Daily Plans**
- [x] Generate plan for any date
- [x] Personalized based on profile
- [x] Workout, nutrition, hydration included
- [x] Stored in MongoDB

✅ **Account Actions**
- [x] Deactivate account (reversible)
- [x] Delete account (permanent)
- [x] Password verification works
- [x] Proper database updates
- [x] User logged out after action

✅ **UI/UX**
- [x] Responsive on all devices
- [x] Clear visual hierarchy
- [x] Intuitive navigation
- [x] No broken layouts
- [x] Consistent styling

✅ **Security**
- [x] Password verification enforced
- [x] Account status checked on login
- [x] Tokens managed securely
- [x] Sensitive operations logged

---

## Next Steps After Testing

1. **Fix Any Bugs Found**
   - Document each bug
   - Prioritize by severity
   - Fix and retest

2. **Optimize Performance**
   - Profile slow queries
   - Add caching where needed
   - Optimize API calls

3. **Enhance Admin Features**
   - Build admin dashboard
   - Add user management
   - Implement analytics

4. **Add More Features**
   - Progress tracking charts
   - Notifications/reminders
   - Social features
   - Gamification

5. **Prepare for Production**
   - Set up CI/CD pipeline
   - Configure production environment
   - Security audit
   - Load testing

---

## Support

For issues or questions:
- Check [ACCOUNT_MANAGEMENT_GUIDE.md](./ACCOUNT_MANAGEMENT_GUIDE.md)
- Check [ENHANCED_FEATURES_GUIDE.md](./ENHANCED_FEATURES_GUIDE.md)
- Review backend logs
- Check browser console
- Verify all services running

Good luck with testing! 🚀
