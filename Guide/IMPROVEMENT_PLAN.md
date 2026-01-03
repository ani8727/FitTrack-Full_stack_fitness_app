# 🚀 FitTrack Project Improvement Plan & Implementation Guide

## Current Status Overview

### ✅ What's Working:
1. **Infrastructure Services**
   - Docker containers (MySQL, MongoDB, RabbitMQ, Keycloak, Redis) - Running
   - Config Server (8888) - Active
   - Eureka Server (8761) - Active with all services registered
   - API Gateway (8085) - Routing correctly

2. **Backend Services**
   - User Service (8081) - Registration, profile management
   - Activity Service (8082) - Activity CRUD operations
   - Admin Service (8083) - User management, statistics
   - AI Service (8084) - Message processing, Gemini AI integration

3. **Frontend**
   - React app running on port 5173
   - OAuth2 authentication flow
   - Dashboard, Activities, Profile pages

### 🔧 Areas Requiring Improvement

---

## 1. User Authentication & Registration Flow

### Current Issues:
- OAuth2 login redirects to Keycloak but users don't exist in Keycloak
- Registration creates users in MySQL but not in Keycloak
- No automatic Keycloak user synchronization

### Required Improvements:

#### A. **Keycloak Integration for Registration**

**Problem:** When users register via `/api/users/register`, they're only created in MySQL database, not in Keycloak. This means they can't login via OAuth2.

**Solution:** Update User Service to create Keycloak users during registration.

**Implementation Steps:**

1. **Add Keycloak Admin Client Dependency** (if not present)
```xml
<!-- In userservice/pom.xml -->
<dependency>
    <groupId>org.keycloak</groupId>
    <artifactId>keycloak-admin-client</artifactId>
    <version>23.0.0</version>
</dependency>
```

2. **Create Keycloak Configuration**
```java
// userservice/src/main/java/com/fitness/userservice/config/KeycloakConfig.java
@Configuration
public class KeycloakConfig {
    
    @Value("${keycloak.auth-server-url}")
    private String serverUrl;
    
    @Value("${keycloak.realm}")
    private String realm;
    
    @Value("${keycloak.admin.username}")
    private String adminUsername;
    
    @Value("${keycloak.admin.password}")
    private String adminPassword;
    
    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
            .serverUrl(serverUrl)
            .realm("master")
            .username(adminUsername)
            .password(adminPassword)
            .clientId("admin-cli")
            .build();
    }
}
```

3. **Add Keycloak properties to application.yml**
```yaml
keycloak:
  auth-server-url: http://localhost:8181
  realm: fitness-app
  admin:
    username: admin
    password: admin
```

4. **Create KeycloakService**
```java
// userservice/src/main/java/com/fitness/userservice/service/KeycloakService.java
@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakService {
    
    private final Keycloak keycloak;
    
    @Value("${keycloak.realm}")
    private String realm;
    
    public String createUser(RegisterRequest request) {
        try {
            UserRepresentation user = new UserRepresentation();
            user.setUsername(request.getEmail());
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEnabled(true);
            user.setEmailVerified(true);
            
            // Create user
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();
            Response response = usersResource.create(user);
            
            if (response.getStatus() != 201) {
                log.error("Failed to create Keycloak user: {}", response.getStatusInfo());
                throw new RuntimeException("Failed to create user in Keycloak");
            }
            
            // Extract user ID from location header
            String userId = extractUserIdFromLocation(response.getLocation());
            
            // Set password
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(request.getPassword());
            credential.setTemporary(false);
            
            usersResource.get(userId).resetPassword(credential);
            
            // Assign default role
            assignRole(userId, "user");
            
            return userId;
            
        } catch (Exception e) {
            log.error("Error creating Keycloak user", e);
            throw new RuntimeException("Failed to create user in Keycloak", e);
        }
    }
    
    private String extractUserIdFromLocation(URI location) {
        String path = location.getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }
    
    private void assignRole(String userId, String roleName) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            RoleRepresentation role = realmResource.roles().get(roleName).toRepresentation();
            realmResource.users().get(userId).roles().realmLevel().add(Arrays.asList(role));
        } catch (Exception e) {
            log.error("Error assigning role to user", e);
        }
    }
    
    public void updateUser(String keycloakId, String firstName, String lastName, String email) {
        try {
            UserRepresentation user = keycloak.realm(realm).users().get(keycloakId).toRepresentation();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            keycloak.realm(realm).users().get(keycloakId).update(user);
        } catch (Exception e) {
            log.error("Error updating Keycloak user", e);
            throw new RuntimeException("Failed to update user in Keycloak", e);
        }
    }
    
    public void deleteUser(String keycloakId) {
        try {
            keycloak.realm(realm).users().get(keycloakId).remove();
        } catch (Exception e) {
            log.error("Error deleting Keycloak user", e);
            throw new RuntimeException("Failed to delete user in Keycloak", e);
        }
    }
}
```

5. **Update UserService to use KeycloakService**
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final PasswordEncoder passwordEncoder;
    
    public UserResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists");
        }
        
        // Create user in Keycloak first
        String keycloakId = keycloakService.createUser(request);
        
        // Create user in database
        User user = User.builder()
            .keycloakId(keycloakId)
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .role("USER")
            .createAt(LocalDateTime.now())
            .updateAt(LocalDateTime.now())
            .build();
            
        user = userRepository.save(user);
        
        return UserResponse.builder()
            .id(user.getId())
            .keycloakId(user.getKeycloakId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }
}
```

#### B. **Setup Keycloak Realm and Client**

**Manual Steps Required:**

1. **Access Keycloak Admin Console**
   - URL: http://localhost:8181
   - Login: admin/admin

2. **Create Realm**
   - Click dropdown at top-left (currently showing "master")
   - Click "Create Realm"
   - Name: `fitness-app`
   - Enabled: Yes
   - Click "Create"

3. **Create Client for Frontend**
   - Go to Clients → Create client
   - Client ID: `fitness-frontend`
   - Client Protocol: `openid-connect`
   - Click "Next"
   - **Client authentication**: OFF (public client)
   - **Authorization**: OFF
   - **Standard flow**: Enabled
   - **Direct access grants**: Enabled
   - Click "Save"
   - **Valid redirect URIs**: 
     - `http://localhost:5173/*`
     - `http://localhost:5173`
   - **Valid post logout redirect URIs**: `http://localhost:5173`
   - **Web origins**: `http://localhost:5173`
   - Click "Save"

4. **Create Roles**
   - Go to Realm roles → Create role
   - Role name: `user`
   - Click "Save"
   - Create another role: `admin`

5. **Create Test Admin User** (Optional)
   - Go to Users → Add user
   - Username: `admin@fitness.com`
   - Email: `admin@fitness.com`
   - First name: `Admin`
   - Last name: `User`
   - Email verified: Yes
   - Enabled: Yes
   - Click "Create"
   - Go to Credentials tab
   - Set password: `admin123`
   - Temporary: OFF
   - Click "Set password"
   - Go to Role mapping tab
   - Click "Assign role"
   - Select `admin` role
   - Click "Assign"

#### C. **Update Frontend OAuth Configuration**

**Update authConfig.js:**
```javascript
// fitness-app-frontend/src/authConfig.js
export const authConfig = {
  clientId: 'fitness-frontend',
  authorizationEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8181/realms/fitness-app/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173',
  scope: 'openid profile email',
  onRefreshTokenExpire: (event) => {
    console.warn('Refresh token expired', event);
    window.location.href = '/login';
  }
};
```

---

## 2. AI Service Enhancements

### Current State:
- AI service listens to RabbitMQ queue
- Processes activities and generates recommendations via Gemini AI
- Stores recommendations in MongoDB

### Required Improvements:

#### A. **Add Endpoint to Fetch User Recommendations**

**Problem:** Frontend recommendations page has no API endpoint to fetch data.

**Solution:** API is already created at `/api/recommendations/user/{userId}`, but needs to be accessible via Gateway.

**Gateway Configuration Check:**
```yaml
# gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: ai-service
          uri: lb://AI-SERVICE
          predicates:
            - Path=/api/recommendations/**
          filters:
            - RewritePath=/api/recommendations/(?<segment>.*), /api/recommendations/${segment}
```

#### B. **Update Frontend to Fetch Recommendations**

**Update Recommendations.jsx:**
```javascript
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { getRecommendations } from '../services/api'

const Recommendations = () => {
  const { tokenData } = useContext(AuthContext)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const userId = tokenData?.sub // Keycloak user ID
      if (!userId) {
        setError('User not authenticated')
        return
      }
      
      const response = await getRecommendations(userId)
      setItems(response.data || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setError('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">AI Recommendations</h2>
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <div className="text-gray-400 text-center">Loading recommendations...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">AI Recommendations</h2>
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">AI Recommendations</h2>
      
      {items.length === 0 ? (
        <div className="bg-black/20 rounded-xl p-5 border border-white/5">
          <div className="text-gray-400">
            No recommendations yet. Log some activities to see AI-powered insights!
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((rec, idx) => (
            <div key={idx} className="bg-black/20 rounded-xl p-6 border border-white/5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {rec.activityType} Activity Analysis
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                  AI Generated
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Analysis</h4>
                  <p className="text-gray-200">{rec.recommendation}</p>
                </div>
                
                {rec.improvements && rec.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">💪 Improvements</h4>
                    <ul className="space-y-1">
                      {rec.improvements.map((imp, i) => (
                        <li key={i} className="text-gray-200 text-sm flex items-start">
                          <span className="text-primary-400 mr-2">•</span>
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {rec.suggestions && rec.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">💡 Suggestions</h4>
                    <ul className="space-y-1">
                      {rec.suggestions.map((sug, i) => (
                        <li key={i} className="text-gray-200 text-sm flex items-start">
                          <span className="text-secondary-400 mr-2">•</span>
                          {sug}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {rec.safety && rec.safety.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">⚠️ Safety</h4>
                    <ul className="space-y-1">
                      {rec.safety.map((safe, i) => (
                        <li key={i} className="text-gray-200 text-sm flex items-start">
                          <span className="text-accent-400 mr-2">•</span>
                          {safe}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Recommendations
```

**Add API function to services/api.js:**
```javascript
export const getRecommendations = async (userId) => {
  return await apiClient.get(`/recommendations/user/${userId}`);
};
```

---

## 3. Admin Panel Enhancements

### Current State:
- Admin dashboard shows statistics
- Admin users page exists
- Missing proper role-based access control

### Required Improvements:

#### A. **Implement Proper Admin Role Check**

**Add role checking utility:**
```javascript
// fitness-app-frontend/src/utils/auth.js
export const hasRole = (tokenData, role) => {
  if (!tokenData) return false;
  
  const roles = tokenData.realm_access?.roles || [];
  return roles.includes(role);
};

export const isAdmin = (tokenData) => {
  return hasRole(tokenData, 'admin');
};
```

**Protect admin routes in App.jsx:**
```javascript
import { hasRole, isAdmin } from './utils/auth';

// Inside Routes
<Route 
  path="/admin" 
  element={
    isAdmin(tokenData) ? 
      <AdminDashboard /> : 
      <Navigate to="/dashboard" replace />
  } 
/>
<Route 
  path="/admin/users" 
  element={
    isAdmin(tokenData) ? 
      <AdminUsersPage /> : 
      <Navigate to="/dashboard" replace />
  } 
/>
```

#### B. **Add Admin Menu Items**

**Update Navbar to show admin link only for admins:**
```javascript
{isAdmin(tokenData) && (
  <Link 
    to="/admin" 
    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
  >
    Admin Panel
  </Link>
)}
```

---

## 4. Profile Update Improvements

### Current State:
- Profile page shows user info
- Edit functionality exists but may not update Keycloak

### Required Improvements:

**Update UserService to sync with Keycloak:**
```java
public UserResponse updateUserProfile(String userId, UpdateUserRequest request) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Update in Keycloak
    keycloakService.updateUser(
        user.getKeycloakId(),
        request.getFirstName(),
        request.getLastName(),
        request.getEmail()
    );
    
    // Update in database
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setEmail(request.getEmail());
    user.setUpdateAt(LocalDateTime.now());
    
    user = userRepository.save(user);
    
    return mapToResponse(user);
}
```

---

## 5. Testing Checklist

### A. User Registration Flow
- [ ] Register new user via frontend
- [ ] Verify user created in MySQL
- [ ] Verify user created in Keycloak
- [ ] Login with new user credentials
- [ ] Access dashboard successfully

### B. Activity Logging & AI
- [ ] Log an activity (Running, 30 min, 250 cal)
- [ ] Verify activity saved in MongoDB
- [ ] Check RabbitMQ queue for message
- [ ] Verify AI service processes message
- [ ] Check recommendations generated
- [ ] View recommendations in frontend

### C. Admin Features
- [ ] Login as admin user
- [ ] Access admin dashboard
- [ ] View all users
- [ ] View system statistics
- [ ] Regular users cannot access admin panel

### D. Profile Management
- [ ] View profile
- [ ] Edit profile information
- [ ] Save changes
- [ ] Verify changes in both MySQL and Keycloak
- [ ] Logout and login to see updated info

---

## 6. Quick Start Commands

### Start Everything:
```bash
# 1. Start Docker services
cd c:\Users\anike\Desktop\Project\fitness_app
docker-compose up -d

# 2. Wait for services to be healthy (30 seconds)
timeout /t 30

# 3. Start all Spring Boot services
start-all.bat

# 4. Wait for services to register with Eureka (1-2 minutes)
# Check: http://localhost:8761
```

### Verify System Health:
```bash
# Check all services registered
curl http://localhost:8761

# Check AI service health
curl http://localhost:8084/actuator/health

# Check RabbitMQ queues
curl -u guest:guest http://localhost:15672/api/queues

# Check Gateway routing
curl http://localhost:8085/actuator/health
```

### Test User Registration:
```bash
curl -X POST http://localhost:8085/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 7. Common Issues & Solutions

### Issue 1: Users Can't Login After Registration
**Cause:** User not created in Keycloak
**Solution:** Implement KeycloakService integration (Section 1A)

### Issue 2: No Recommendations Appearing
**Cause:** Not enough activities or AI service not processing
**Solution:** 
- Log at least 5 activities
- Check RabbitMQ queue is being consumed
- Check AI service logs

### Issue 3: Admin Panel Not Accessible
**Cause:** User doesn't have admin role
**Solution:** Assign admin role in Keycloak (Section 1B, step 5)

### Issue 4: Frontend Can't Connect to Backend
**Cause:** Gateway routing or CORS issues
**Solution:** Check Gateway configuration and CORS settings

---

## 8. Implementation Priority

### Phase 1: Critical (Must Complete First)
1. ✅ Setup Keycloak realm and client
2. ✅ Implement KeycloakService for user creation
3. ✅ Update registration flow to create Keycloak users
4. ✅ Configure frontend OAuth with correct realm

### Phase 2: Important (Complete Next)
1. ✅ Update Recommendations page to fetch and display data
2. ✅ Implement admin role-based access control
3. ✅ Sync profile updates with Keycloak

### Phase 3: Enhancements (Nice to Have)
1. ⚪ Add email verification
2. ⚪ Implement password reset
3. ⚪ Add user avatar upload
4. ⚪ Implement activity goals
5. ⚪ Add social features

---

## Summary

Your FitTrack application has a solid foundation with all major services running. The main gaps are:

1. **Keycloak Integration** - Users can register but can't login because they're not in Keycloak
2. **AI Recommendations Display** - AI generates recommendations but frontend doesn't show them properly
3. **Admin Access Control** - Admin features need proper role-based protection

Once you implement the improvements in Phase 1 and Phase 2, your application will be fully functional with:
- ✅ Complete user registration and login
- ✅ Activity tracking with AI recommendations
- ✅ Admin panel for user management
- ✅ Profile management with Keycloak sync
- ✅ End-to-end working system

**Start with Phase 1 (Keycloak integration) as it's the most critical for user authentication!**
