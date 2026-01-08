import { Suspense, lazy, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./features/activities/ActivityForm";
import ActivityList from "./features/activities/ActivityList";
import ActivityDetail from "./features/activities/ActivityDetail";
import SiteLayout from "./shared/ui/SiteLayout";
import Recommendations from "./features/recommendations/Recommendations";
import Profile from "./features/profile/Profile";

const Dashboard = lazy(() => import("./pages/DashboardEnhanced"));
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const Terms = lazy(() => import("./features/legal/Terms"));
const Privacy = lazy(() => import("./features/legal/Privacy"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfileUpdatePage = lazy(() => import("./pages/ProfileUpdatePage"));
const DailyPlanPage = lazy(() => import("./pages/DailyPlanPage"));
const OnboardingWizard = lazy(() => import("./pages/OnboardingWizard"));
const AccountSettingsPage = lazy(() => import("./pages/AccountSettingsPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const ActvitiesPage = () => {
  const location = useLocation()
  useEffect(() => {
    if (location.hash === '#add-activity') {
      requestAnimationFrame(() => {
        const el = document.getElementById('add-activity')
        if (el && el.isConnected) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    }
  }, [location])

  return (
    <div className="space-y-4">
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </div>
  )
}

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [showRegister, setShowRegister] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  const isAdmin = useMemo(() => {
    const roles = tokenData?.realm_access?.roles || tokenData?.roles || [];
    return Array.isArray(roles) && roles.includes('ADMIN');
  }, [tokenData]);
  
  useEffect(() => {
    if (token) {
      // Store token in localStorage for API interceptor
      localStorage.setItem('token', token);
      if (tokenData?.sub) {
        localStorage.setItem('userId', tokenData.sub);
      }
      
      dispatch(setCredentials({token, user: tokenData}));
      setShowHome(false);
      checkOnboarding();
    }
  }, [token, tokenData, dispatch]);

  const checkOnboarding = async () => {
    // Check if user has completed onboarding
    // You can implement this by checking user profile completeness
    // For now, we'll assume first-time users need onboarding
    setCheckingOnboarding(false);
    // setNeedsOnboarding(true); // Uncomment to enable onboarding for all users
  };

  // Show register page
  if (showRegister && !token) {
    return (
      <Router>
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <RegisterPage onSuccess={() => {
            setShowRegister(false)
            setShowHome(true)
          }} />
        </Suspense>
      </Router>
    )
  }

  // Show home page for non-authenticated users
  if (!token && showHome) {
    return (
      <Router>
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <HomePage onLogin={() => {
            setShowHome(false);
            logIn();
          }} />
        </Suspense>
      </Router>
    )
  }

  // Show onboarding wizard for new users
  if (token && needsOnboarding && !checkingOnboarding) {
    return (
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <OnboardingWizard onComplete={() => setNeedsOnboarding(false)} />
      </Suspense>
    )
  }

  return (
    <Router>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        {!token ? (
          <SiteLayout isAuthenticated={false}>
            <LoginPage 
              onLogin={logIn} 
              onRegister={() => setShowRegister(true)}
            />
          </SiteLayout>
        ) : (
          <SiteLayout isAuthenticated={true} onLogout={logOut}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activities" element={<ActvitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/daily-plan" element={<DailyPlanPage />} />
              <Route path="/profile" element={<Profile user={tokenData} />} />
              <Route path="/profile/edit" element={<ProfilePage />} />
              <Route path="/settings/account" element={<AccountSettingsPage />} />
              <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" replace/>} />
              <Route path="/admin/users" element={isAdmin ? <AdminUsersPage /> : <Navigate to="/dashboard" replace/>} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/" element={<Navigate to="/dashboard" replace/>} />
              <Route path="*" element={<Navigate to="/dashboard" replace/>} />
            </Routes>
          </SiteLayout>
        )}
      </Suspense>
    </Router>
  )
}

export default App