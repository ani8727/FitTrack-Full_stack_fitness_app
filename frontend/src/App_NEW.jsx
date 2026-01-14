import { Suspense, lazy, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import SiteLayout from "./shared/ui/SiteLayout";

// Lazy load pages
const HomePage = lazy(() => import("./pages/HomePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Dashboard = lazy(() => import("./pages/DashboardEnhanced"));
const ActivityForm = lazy(() => import("./features/activities/ActivityForm"));
const ActivityList = lazy(() => import("./features/activities/ActivityList"));
const ActivityDetail = lazy(() => import("./features/activities/ActivityDetail"));
const Recommendations = lazy(() => import("./features/recommendations/Recommendations"));
const Profile = lazy(() => import("./features/profile/Profile"));
const Terms = lazy(() => import("./features/legal/Terms"));
const Privacy = lazy(() => import("./features/legal/Privacy"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfileUpdatePage = lazy(() => import("./pages/ProfileUpdatePage"));
const DailyPlanPage = lazy(() => import("./pages/DailyPlanPage"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const AccountSettingsPage = lazy(() => import("./pages/AccountSettingsPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

/**
 * RoleBasedRedirect Component
 * Redirects authenticated users to their appropriate dashboard
 */
const RoleBasedRedirect = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract roles from various possible locations in Auth0 token
    const roles = user?.['https://fitness-app/roles'] || 
                  user?.roles || 
                  user?.['fitness_auth/roles'] || 
                  [];
    
    const isAdmin = Array.isArray(roles) && 
                    (roles.includes('admin') || roles.includes('ADMIN'));
    
    // Redirect based on role
    if (isAdmin) {
      navigate('/admin-dashboard', { replace: true });
    } else {
      navigate('/user-dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-[var(--color-text-muted)]">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

/**
 * Main App Component with Auth0 Integration
 */
function App() {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();
  const dispatch = useDispatch();

  // Extract user roles
  const userRoles = useMemo(() => {
    return user?.['https://fitness-app/roles'] || 
           user?.roles || 
           user?.['fitness_auth/roles'] || 
           [];
  }, [user]);

  const isAdmin = useMemo(() => {
    return Array.isArray(userRoles) && 
           (userRoles.includes('admin') || userRoles.includes('ADMIN'));
  }, [userRoles]);

  // Get and store access token when authenticated
  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          const accessToken = await getAccessTokenSilently();
          
          // Store token in sessionStorage for API interceptor
          sessionStorage.setItem('token', accessToken);
          if (user?.sub) {
            sessionStorage.setItem('userId', user.sub);
          }
          
          // Update Redux store
          dispatch(setCredentials({ token: accessToken, user }));
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, isLoading, user, dispatch, getAccessTokenSilently]);

  // Show loading state while Auth0 initializes
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-[var(--color-text-muted)]">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show HomePage for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Router>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        }>
          <Routes>
            <Route path="/*" element={<HomePage onLogin={() => loginWithRedirect()} />} />
          </Routes>
        </Suspense>
      </Router>
    );
  }

  // Main authenticated app with role-based routing
  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-[var(--color-text-muted)]">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          {/* Root redirect based on role */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Admin Dashboard - Protected, requires admin role */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* User Dashboard - Protected, for regular users */}
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Existing protected routes with SiteLayout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <Dashboard />
              </SiteLayout>
            </ProtectedRoute>
          } />

          <Route path="/activities" element={
            <ProtectedRoute>
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <div className="space-y-4">
                  <ActivityForm onActivityAdded={() => window.location.reload()} />
                  <ActivityList />
                </div>
              </SiteLayout>
            </ProtectedRoute>
          } />

          <Route path="/activities/:id" element={
            <ProtectedRoute>
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <ActivityDetail />
              </SiteLayout>
            </ProtectedRoute>
          } />

          <Route path="/recommendations" element={
            <ProtectedRoute>
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <Recommendations />
              </SiteLayout>
            </ProtectedRoute>
          } />

          <Route path="/daily-plan" element={
            <ProtectedRoute>
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <DailyPlanPage />
              </SiteLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <Profile user={user} />
              </SiteLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile/edit" element={
            <ProtectedRoute>
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <ProfilePage />
              </SiteLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings/account" element={
            <ProtectedRoute>
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <AccountSettingsPage />
              </SiteLayout>
            </ProtectedRoute>
          } />

          {/* Admin routes - require admin role */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <AdminDashboard />
              </SiteLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <AdminUsersPage />
              </SiteLayout>
            </ProtectedRoute>
          } />

          {/* Legal pages - public access */}
          <Route path="/terms" element={
            <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              <Terms />
            </SiteLayout>
          } />

          <Route path="/privacy" element={
            <SiteLayout isAuthenticated={true} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              <Privacy />
            </SiteLayout>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
