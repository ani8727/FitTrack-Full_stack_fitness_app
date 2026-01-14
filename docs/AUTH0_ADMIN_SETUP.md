# Auth0 Admin Role Setup Guide

## Overview
This guide explains how to set up admin roles in Auth0 for the FitTrack application. Admin roles grant access to administrative features like user management.

## Prerequisites
- Auth0 Application already configured (domain, client ID, audience)
- Admin access to your Auth0 dashboard
- User to be assigned the admin role

## Step 1: Create a Role in Auth0

1. Go to **Auth0 Dashboard** → **User Management** → **Roles**
2. Click **Create role**
3. Fill in the details:
   - **Name**: `ADMIN` (must match exactly)
   - **Description**: `Administrator role with full access`
4. Click **Create**

## Step 2: Add Role to User

1. Go to **Auth0 Dashboard** → **User Management** → **Users**
2. Select the user you want to make an admin
3. Go to the **Roles** tab
4. Click **Assign roles**
5. Select the `ADMIN` role
6. Click **Assign**

## Step 3: Create Action (Auth0 Rules) to Include Roles in JWT

1. Go to **Auth0 Dashboard** → **Actions** → **Flows**
2. Select **Login** flow
3. Click **Add Action** → **Create action**
4. Name: `Add Roles to Token`
5. Select **Login / Post Login** trigger
6. Replace the code with:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://fitness.app';
  
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }
};
```

7. Click **Deploy**

## Step 4: Add the Action to Login Flow

1. In the **Login** flow, find your created action
2. Drag it into the flow (after the **Start** node)
3. Click **Save**

## Step 5: Verify in Your Application

### Frontend Verification
1. Login with an admin user
2. Open browser DevTools → **Application** → **Local Storage**
3. Find the Auth0 token
4. Look for role claims: Check for `roles` or `https://fitness.app/roles` or `fitness_auth/roles`

### Backend Verification
1. Call an admin endpoint: `GET http://localhost:8085/api/users/admin/list`
2. Should return 200 (success) if admin role is recognized
3. Non-admin users should get 403 (Forbidden)

## JWT Token Format

Your token should include roles in one of these formats:

```json
// Format 1: Direct roles claim
{
  "roles": ["ADMIN"]
}

// Format 2: Auth0 namespace
{
  "https://fitness.app/roles": ["ADMIN"]
}

// Format 3: Audience-specific
{
  "fitness_auth/roles": ["ADMIN"]
}
```

## Supported Role Names

The application recognizes:
- `ADMIN` (uppercase)
- `admin` (lowercase)
- `ROLE_ADMIN` (with ROLE_ prefix)

## Testing Admin Features

### Available Admin Endpoints
- `GET /api/users/admin/list` - List all users
- `PUT /api/users/admin/{id}` - Update user (admin only)
- `DELETE /api/users/admin/{id}` - Delete user (admin only)

### Frontend Admin Page
1. Login with admin account
2. Navigate to `/admin` or `/admin/users`
3. Should see admin dashboard

## Troubleshooting

### Admin Features Not Working

**Check 1: Token Contains Roles?**
```bash
# Decode JWT at https://jwt.io
# Look for "roles" claim in payload
```

**Check 2: Auth0 Action Deployed?**
- Go to Actions → Flows → Login
- Verify "Add Roles to Token" is in the flow
- Should have green checkmark ✓

**Check 3: User Has Role?**
- Go to Auth0 Dashboard → Users → Select user
- Go to "Roles" tab
- Verify ADMIN role is assigned

**Check 4: Backend Recognizes Roles?**
- Check [SecurityConfig.java](../backend/userservice/src/main/java/com/fitness/userservice/config/SecurityConfig.java)
- Should have `extractAuthorities()` method with role extraction
- Should handle all claim formats

### Frontend Shows Admin Menu But Backend Rejects

This usually means:
1. JWT doesn't include roles claim
2. Role format doesn't match backend expectations
3. Auth0 Action not deployed yet

**Solution:**
1. Verify Auth0 Action is deployed (check in Dashboard)
2. Logout and login again (to get new token)
3. Check token in JWT.io for roles claim
4. Check backend logs for role extraction

## Reference

- [Auth0 Actions Documentation](https://auth0.com/docs/customize/actions)
- [Auth0 Roles and Permissions](https://auth0.com/docs/manage-users/access-control/rbac)
- [Auth0 Custom Claims](https://auth0.com/docs/get-started/apis/scopes/sample-implementation-user-roles)
