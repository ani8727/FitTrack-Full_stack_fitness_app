# Keycloak Setup Guide for FitTrack

This guide will help you configure Keycloak for OAuth2/OIDC authentication in the FitTrack application.

## Prerequisites
- Keycloak running in Docker: http://localhost:8181
- Admin credentials: `admin` / `admin`

---

## Step 1: Access Keycloak Admin Console

1. Open browser: **http://localhost:8181**
2. Click **"Administration Console"**
3. Login with:
   - **Username:** `admin`
   - **Password:** `admin`

---

## Step 2: Create Realm

A realm manages a set of users, credentials, roles, and groups.

1. Click the dropdown at the top left (currently shows **"master"**)
2. Click **"Create Realm"** button
3. Fill in:
   - **Realm name:** `fitness-oauth2`
   - **Enabled:** ON (toggle should be blue)
4. Click **"Create"** button

You'll now be in the `fitness-oauth2` realm.

---

## Step 3: Create Client

Clients are applications that can request authentication.

1. From left sidebar, click **"Clients"**
2. Click **"Create client"** button
3. **General Settings:**
   - **Client type:** `OpenID Connect`
   - **Client ID:** `fitness-client`
   - Click **"Next"**
4. **Capability config:**
   - **Client authentication:** OFF (for public client/PKCE)
   - **Authorization:** OFF
   - **Authentication flow:**
     - ✅ Standard flow (for web)
     - ✅ Direct access grants (for testing)
   - Click **"Next"**
5. **Login settings:**
   - **Root URL:** `http://localhost:5173`
   - **Home URL:** `http://localhost:5173`
   - **Valid redirect URIs:** `http://localhost:5173/*`
   - **Valid post logout redirect URIs:** `http://localhost:5173/*`
   - **Web origins:** `http://localhost:5173`
   - Click **"Save"**

---

## Step 4: Configure Client Settings

1. Still in the `fitness-client` settings:
2. Scroll to **"Advanced"** section at bottom
3. **Proof Key for Code Exchange Code Challenge Method:** Select `S256` (required for PKCE)
4. Click **"Save"** at bottom

---

## Step 5: Create Users

1. From left sidebar, click **"Users"**
2. Click **"Create new user"** button
3. Fill in:
   - **Username:** `testuser`
   - **Email:** `test@fitness.com`
   - **Email verified:** ON (toggle blue)
   - **First name:** `Test`
   - **Last name:** `User`
   - **Enabled:** ON
4. Click **"Create"**

### Set Password:

1. Click on the newly created user (`testuser`)
2. Go to **"Credentials"** tab
3. Click **"Set password"** button
4. Fill in:
   - **Password:** `password123`
   - **Password confirmation:** `password123`
   - **Temporary:** OFF (so user doesn't need to change it)
5. Click **"Save"**
6. Confirm by clicking **"Save password"** in popup

### Create More Test Users (Optional):

Repeat the above process for additional users:
- **Username:** `john.doe` | Password: `password123`
- **Username:** `jane.smith` | Password: `password123`

---

## Step 6: Create Roles (Optional)

Roles can be used for authorization.

1. From left sidebar, click **"Realm roles"**
2. Click **"Create role"** button
3. Create these roles:
   - **Role name:** `user` → Click "Save"
   - **Role name:** `admin` → Click "Save"

### Assign Roles to Users:

1. Go to **"Users"** → Select `testuser`
2. Click **"Role mapping"** tab
3. Click **"Assign role"** button
4. Select `user` role
5. Click **"Assign"**

---

## Step 7: Verify Realm Settings

1. From left sidebar, click **"Realm settings"**
2. Go to **"General"** tab
3. Verify:
   - **Realm ID:** `fitness-oauth2`
   - **Enabled:** ON
4. Go to **"Login"** tab
5. Recommended settings:
   - **User registration:** OFF (or ON if you want public signup)
   - **Forgot password:** ON
   - **Remember me:** ON
   - **Email as username:** ON (optional)

---

## Step 8: Get OpenID Configuration

This is needed for your application configuration:

**OpenID Configuration URL:**
```
http://localhost:8181/realms/fitness-oauth2/.well-known/openid-configuration
```

Open this URL in your browser to see all OAuth2 endpoints.

**Key Endpoints:**
- **Authorization:** `http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth`
- **Token:** `http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token`
- **UserInfo:** `http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/userinfo`
- **Logout:** `http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/logout`

---

## Step 9: Update Frontend Configuration

Update `fitness-app-frontend/src/authConfig.js`:

```javascript
export const authConfig = {
  authority: 'http://localhost:8181/realms/fitness-oauth2',
  client_id: 'fitness-client',
  redirect_uri: 'http://localhost:5173',
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: 'http://localhost:5173',
  automaticSilentRenew: true,
  loadUserInfo: true,
};
```

---

## Step 10: Test Authentication

1. **Start all services:**
   ```cmd
   restart-rabbitmq-services.bat
   ```

2. **Start frontend:**
   ```cmd
   cd fitness-app-frontend
   npm run dev
   ```

3. **Open frontend:** http://localhost:5173

4. **Click "Login"** button

5. **You should be redirected to Keycloak login page:**
   - Enter username: `testuser`
   - Enter password: `password123`
   - Click "Sign In"

6. **After successful login, you should be redirected back to the app**

---

## Troubleshooting

### Issue: "Invalid redirect URI"
**Solution:** Double-check the Valid redirect URIs in Client settings includes `http://localhost:5173/*`

### Issue: "Client not found"
**Solution:** Verify client_id is `fitness-client` in both Keycloak and authConfig.js

### Issue: "User not found"
**Solution:** Make sure the user is created in the `fitness-oauth2` realm (not master realm)

### Issue: "Invalid credentials"
**Solution:** 
- Verify password is set correctly
- Make sure "Temporary" is OFF when setting password
- Try resetting the password

### Issue: CORS errors
**Solution:** Make sure Web origins is set to `http://localhost:5173` in Client settings

---

## Quick Test Credentials

After setup, you can use these credentials to test:

| Username | Password | Role |
|----------|----------|------|
| testuser | password123 | user |
| john.doe | password123 | user |
| jane.smith | password123 | user |

---

## Next Steps

1. ✅ Configure Keycloak (this guide)
2. Create RabbitMQ queue (see main instructions)
3. Test user registration endpoint
4. Test activity tracking with authenticated users
5. Test AI recommendations

---

## Additional Resources

- **Keycloak Admin Console:** http://localhost:8181
- **Realm:** fitness-oauth2
- **Client ID:** fitness-client
- **OpenID Config:** http://localhost:8181/realms/fitness-oauth2/.well-known/openid-configuration
