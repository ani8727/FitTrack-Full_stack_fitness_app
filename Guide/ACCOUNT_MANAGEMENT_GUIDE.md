# Complete Feature Implementation Guide - Account Management & Onboarding

## Overview
This document covers the newly implemented features for enhanced user account management, onboarding experience, and administrative capabilities in the FitTrack application.

## New Features Summary

### 1. **User Account Management**
- Account deactivation (temporary)
- Account deletion (permanent)
- Account reactivation
- Password verification for sensitive operations

### 2. **Onboarding Wizard**
- Step-by-step profile setup
- Progress tracking with visual indicators
- Guided data collection for personalized experience
- Completion status tracking

### 3. **Account Settings Page**
- Account information display
- Danger zone with deactivation/deletion options
- Confirmation modals with password verification
- Detailed warnings about consequences

### 4. **Enhanced User Model**
- Account status tracking (ACTIVE, INACTIVE, DEACTIVATED, DELETED, SUSPENDED, BANNED)
- Email verification status
- Onboarding completion tracking
- Last login timestamp
- Deactivation/deletion reason storage

---

## Backend Implementation

### New Enums

#### AccountStatus.java
```java
public enum AccountStatus {
    ACTIVE,           // Account is active and can login
    INACTIVE,         // Account created but not activated
    DEACTIVATED,      // User temporarily deactivated their account
    DELETED,          // Account marked for deletion
    SUSPENDED,        // Admin suspended the account
    BANNED            // Account permanently banned
}
```

### Enhanced User Model

#### Additional Fields in User.java
```java
@Enumerated(EnumType.STRING)
private AccountStatus accountStatus = AccountStatus.ACTIVE;

private Boolean emailVerified = false;
private Boolean onboardingCompleted = false;
private LocalDateTime lastLoginAt;
private LocalDateTime deactivatedAt;
private String deactivationReason;
```

#### Helper Methods
```java
public boolean isActive() {
    return AccountStatus.ACTIVE.equals(accountStatus);
}

public boolean canLogin() {
    return isActive() && Boolean.TRUE.equals(emailVerified);
}

public void markAsDeleted(String reason) {
    this.accountStatus = AccountStatus.DELETED;
    this.deactivatedAt = LocalDateTime.now();
    this.deactivationReason = reason;
}

public void deactivate(String reason) {
    this.accountStatus = AccountStatus.DEACTIVATED;
    this.deactivatedAt = LocalDateTime.now();
    this.deactivationReason = reason;
}

public void reactivate() {
    this.accountStatus = AccountStatus.ACTIVE;
    this.deactivatedAt = null;
    this.deactivationReason = null;
}
```

### New DTOs

#### AccountActionRequest.java
```java
@Data
public class AccountActionRequest {
    private String reason;
    private String password; // For verification before deletion
}
```

#### OnboardingProgress.java
```java
@Data
public class OnboardingProgress {
    private boolean profileCompleted;
    private boolean firstActivityLogged;
    private boolean firstRecommendationViewed;
    private boolean dailyPlanGenerated;
    private int completionPercentage;
    
    public void calculateCompletionPercentage() {
        int completed = 0;
        if (profileCompleted) completed += 25;
        if (firstActivityLogged) completed += 25;
        if (firstRecommendationViewed) completed += 25;
        if (dailyPlanGenerated) completed += 25;
        this.completionPercentage = completed;
    }
}
```

### New Services

#### AccountManagementService.java
```java
@Service
public class AccountManagementService {
    
    public void deactivateAccount(String userId, AccountActionRequest request) {
        // Verifies password and deactivates account
    }
    
    public void deleteAccount(String userId, AccountActionRequest request) {
        // Verifies password and marks account for deletion
    }
    
    public void reactivateAccount(String userId) {
        // Reactivates a deactivated account
    }
    
    public void updateLastLogin(String userId) {
        // Updates last login timestamp
    }
    
    public void completeOnboarding(String userId) {
        // Marks onboarding as completed
    }
}
```

### New REST Endpoints

#### AccountManagementController.java

**Deactivate Account**
```
POST /api/users/{userId}/deactivate
Body: { "password": "string", "reason": "string" }
Response: "Account deactivated successfully"
```

**Delete Account**
```
DELETE /api/users/{userId}/delete
Body: { "password": "string", "reason": "string" }
Response: "Account marked for deletion"
```

**Reactivate Account**
```
POST /api/users/{userId}/reactivate
Response: "Account reactivated successfully"
```

**Complete Onboarding**
```
POST /api/users/{userId}/onboarding/complete
Response: "Onboarding completed"
```

**Get Onboarding Status**
```
GET /api/users/{userId}/onboarding/status
Response: true/false
```

---

## Frontend Implementation

### 1. Onboarding Wizard Component

**File:** `OnboardingWizard.jsx`

#### Features:
- **4-Step Process:**
  1. Basic Info (Gender, Age)
  2. Physical Stats (Height, Weight)
  3. Fitness Goals (Activity Level, Goals, Weekly Target)
  4. Completion Summary

- **Progress Visualization:**
  - Visual step indicators with icons
  - Progress bar between steps
  - Checkmarks for completed steps

- **Validation:**
  - Step-by-step validation
  - Next button disabled until current step is valid
  - Form data persistence across steps

- **Design:**
  - Full-screen immersive experience
  - Gradient background
  - Animated transitions
  - Mobile responsive

#### Usage:
```jsx
<OnboardingWizard onComplete={() => setNeedsOnboarding(false)} />
```

### 2. Account Settings Page

**File:** `AccountSettingsPage.jsx`

#### Features:
- **Account Information Display:**
  - Email address
  - Username
  - Account ID

- **Danger Zone:**
  - Account deactivation option
  - Account deletion option
  - Color-coded warnings (yellow for deactivate, red for delete)

- **Deactivation Modal:**
  - Optional reason field
  - Password verification required
  - Clear explanation of consequences
  - Can be reversed

- **Deletion Modal:**
  - Optional feedback field
  - Password verification required
  - Strong warning message
  - Permanent action notice
  - Data loss warning

#### Design Elements:
- Warning colors and icons
- Confirmation modals with backdrop blur
- Clear visual hierarchy
- Accessible layout

### 3. Updated App.jsx Flow

#### Onboarding Check:
```jsx
const [needsOnboarding, setNeedsOnboarding] = useState(false);
const [checkingOnboarding, setCheckingOnboarding] = useState(true);

useEffect(() => {
    if (token) {
        checkOnboarding();
    }
}, [token]);

// Show onboarding wizard for new users
if (token && needsOnboarding && !checkingOnboarding) {
    return <OnboardingWizard onComplete={() => setNeedsOnboarding(false)} />
}
```

### 4. Updated Navigation

**Sidebar additions:**
- Daily Plan (Calendar icon) - `/daily-plan`
- Settings (Settings icon) - `/settings/account`

### 5. API Service Updates

**New Functions in api.js:**
```javascript
// Account Management
export const deactivateAccount = (userId, data) => 
    api.post(`/users/${userId}/deactivate`, data);
    
export const deleteAccount = (userId, data) => 
    api.delete(`/users/${userId}/delete`, { data });
    
export const reactivateAccount = (userId) => 
    api.post(`/users/${userId}/reactivate`);

// Onboarding
export const completeOnboarding = (userId) => 
    api.post(`/users/${userId}/onboarding/complete`);
    
export const getOnboardingStatus = (userId) => 
    api.get(`/users/${userId}/onboarding/status`);
```

---

## User Workflows

### New User Registration & Onboarding

1. **User registers** via registration page
2. **Login** with new credentials
3. **Onboarding wizard appears automatically**:
   - Step 1: Enter gender and age
   - Step 2: Enter height and weight
   - Step 3: Set fitness goals, activity level, weekly targets
   - Step 4: Review completion summary
4. **Profile saved** and onboarding marked complete
5. **Redirect to dashboard** - ready to use app

### Account Deactivation

1. Navigate to **Settings** from sidebar
2. Scroll to **Danger Zone**
3. Click **Deactivate** button
4. **Modal appears** with:
   - Optional reason field
   - Password verification
5. Confirm deactivation
6. **Logged out automatically**
7. Can reactivate by logging back in

### Account Deletion

1. Navigate to **Settings** from sidebar
2. Scroll to **Danger Zone**
3. Click **Delete** button
4. **Warning modal appears** with:
   - Data loss warning
   - Optional feedback field
   - Password verification
5. Confirm deletion
6. **Account marked for deletion**
7. **Logged out immediately**
8. **All data scheduled for permanent removal**

---

## Database Schema Updates

### MySQL - userservice.users table

**New Columns:**
```sql
ALTER TABLE users ADD COLUMN account_status VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN deactivated_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN deactivation_reason TEXT NULL;
```

---

## Security Considerations

### Password Verification
- All destructive operations require password confirmation
- Prevents unauthorized account changes
- Uses bcrypt password encoder

### Account Status Checks
- Login attempts verify account status
- Deactivated accounts cannot login
- Deleted accounts cannot be accessed

### Data Retention
- Deactivated accounts: Data preserved, can reactivate
- Deleted accounts: Marked for deletion, data can be purged by admin
- Audit trail with timestamps and reasons

---

## Testing Guide

### Test Onboarding Flow

1. Register new user
2. Login
3. Verify onboarding wizard appears
4. Complete all 4 steps
5. Verify redirect to dashboard
6. Check database: `onboarding_completed = true`

### Test Account Deactivation

**API Test:**
```bash
curl -X POST http://localhost:8085/api/users/{userId}/deactivate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "user_password",
    "reason": "Taking a break"
  }'
```

**Frontend Test:**
1. Login
2. Go to Settings → Account
3. Click Deactivate
4. Enter password and reason
5. Confirm
6. Verify logout
7. Check database: `account_status = 'DEACTIVATED'`

### Test Account Deletion

**API Test:**
```bash
curl -X DELETE http://localhost:8085/api/users/{userId}/delete \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "user_password",
    "reason": "No longer need the app"
  }'
```

**Frontend Test:**
1. Login
2. Go to Settings → Account
3. Click Delete
4. Read warnings
5. Enter password and optional feedback
6. Confirm deletion
7. Verify logout
8. Check database: `account_status = 'DELETED'`, `deactivated_at` set

---

## UI/UX Highlights

### Onboarding Wizard
- ✅ Clean, focused interface
- ✅ Visual progress indicators
- ✅ Step validation
- ✅ Can navigate back
- ✅ Mobile responsive
- ✅ Gradient backgrounds
- ✅ Smooth animations

### Account Settings
- ⚠️ Clear danger zone separation
- ⚠️ Color-coded warnings (yellow/red)
- ⚠️ Confirmation modals
- ⚠️ Detailed consequences explained
- ⚠️ Password verification required
- ⚠️ Logout after destructive actions

### Navigation
- 📱 Updated sidebar with new menu items
- 📱 Settings easily accessible
- 📱 Daily Plan prominently featured
- 📱 Consistent icon usage

---

## Admin Capabilities (Future)

### Planned Admin Features:
- View deactivated/deleted accounts
- Reactivate accounts on request
- Permanently purge deleted accounts
- View deactivation reasons for insights
- Suspend/ban abusive accounts
- Generate user activity reports
- Email verification management

---

## Best Practices Implemented

### Code Quality
- ✅ Separation of concerns (Service layer for business logic)
- ✅ DTO pattern for API contracts
- ✅ Helper methods in models
- ✅ Password verification for sensitive operations
- ✅ Logging for audit trail

### User Experience
- ✅ Guided onboarding for new users
- ✅ Clear warnings before destructive actions
- ✅ Reversible operations (deactivation)
- ✅ Password confirmation for security
- ✅ Feedback collection on deletion

### Security
- ✅ Password verification required
- ✅ Account status validation
- ✅ Automatic logout after deletion
- ✅ Audit trail (timestamps, reasons)
- ✅ Soft delete pattern (can recover)

---

## Configuration

### Enable Onboarding for All New Users

In `App.jsx`, uncomment:
```jsx
const checkOnboarding = async () => {
    setCheckingOnboarding(false);
    setNeedsOnboarding(true); // Enable this line
};
```

### Customize Onboarding Steps

Edit steps in `OnboardingWizard.jsx`:
```jsx
const steps = [
    { id: 1, title: 'Basic Info', icon: FiUser },
    { id: 2, title: 'Physical Stats', icon: FiActivity },
    { id: 3, title: 'Fitness Goals', icon: FiTarget },
    { id: 4, title: 'Get Started', icon: FiTrendingUp }
];
```

---

## Troubleshooting

### Onboarding Not Showing
- Check `onboarding_completed` field in database
- Verify `needsOnboarding` state in App.jsx
- Check console for errors

### Deactivation Fails
- Verify password is correct
- Check user exists in database
- Review server logs for errors

### Deletion Not Working
- Ensure DELETE endpoint is configured correctly
- Check CORS settings
- Verify password encoding matches

### Cannot Login After Deactivation
- Check `account_status` in database
- Should be 'DEACTIVATED'
- Implement reactivation on login attempt

---

## Future Enhancements

### Recommended Additions:
1. **Email Verification**
   - Send verification email on registration
   - Verify email before allowing full access
   
2. **Password Reset Flow**
   - Forgot password functionality
   - Email-based reset token
   
3. **Account Recovery**
   - Grace period before permanent deletion
   - Email notification before deletion
   - Reactivation link in email

4. **Two-Factor Authentication**
   - Optional 2FA setup
   - SMS or app-based codes
   
5. **Export Data**
   - Download personal data before deletion
   - GDPR compliance
   
6. **Social Login**
   - Google Sign-In
   - Facebook Login
   
7. **Remember Me**
   - Extended session option
   - Secure token storage

---

## Summary

This implementation provides a complete account management system with:

✅ **User-friendly onboarding** for new users
✅ **Account control** (deactivate/delete)
✅ **Security measures** (password verification)
✅ **Clear UI/UX** with warnings and confirmations
✅ **Backend validation** and audit trail
✅ **Scalable architecture** for future enhancements

The system ensures users have full control over their accounts while maintaining security and data integrity. The onboarding wizard improves user engagement and ensures proper profile setup for personalized AI recommendations.

---

## Quick Reference

**Routes:**
- `/settings/account` - Account settings page
- Onboarding wizard shown automatically for new users

**API Endpoints:**
- `POST /api/users/{userId}/deactivate`
- `DELETE /api/users/{userId}/delete`
- `POST /api/users/{userId}/reactivate`
- `POST /api/users/{userId}/onboarding/complete`
- `GET /api/users/{userId}/onboarding/status`

**Account Statuses:**
- ACTIVE, INACTIVE, DEACTIVATED, DELETED, SUSPENDED, BANNED
