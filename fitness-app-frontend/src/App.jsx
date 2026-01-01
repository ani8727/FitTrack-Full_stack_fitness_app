import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./features/activities/ActivityForm";
import ActivityList from "./features/activities/ActivityList";
import ActivityDetail from "./features/activities/ActivityDetail";
import SiteLayout from "./shared/ui/SiteLayout";
import Dashboard from "./pages/DashboardEnhanced";
import Profile from "./features/profile/Profile";
import Recommendations from "./features/recommendations/Recommendations";
import LoginPage from "./features/auth/LoginPage";
import Terms from "./features/legal/Terms";
import Privacy from "./features/legal/Privacy";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ProfileUpdatePage from "./pages/ProfileUpdatePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";

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
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showHome, setShowHome] = useState(true);
  
  useEffect(() => {
    if (token) {
      dispatch(setCredentials({token, user: tokenData}));
      setAuthReady(true);
      setShowHome(false);
    }
  }, [token, tokenData, dispatch]);

  // Show register page
  if (showRegister && !token) {
    return (
      <Router>
        <RegisterPage onSuccess={() => setShowRegister(false)} />
      </Router>
    )
  }

  // Show home page for non-authenticated users
  if (!token && showHome) {
    return (
      <Router>
        <HomePage onLogin={() => {
          setShowHome(false);
          logIn();
        }} />
      </Router>
    )
  }

  return (
    <Router>
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
            <Route path="/profile" element={<Profile user={tokenData} />} />
            <Route path="/profile/edit" element={<ProfileUpdatePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/" element={<Navigate to="/dashboard" replace/>} />
            <Route path="*" element={<Navigate to="/dashboard" replace/>} />
          </Routes>
        </SiteLayout>
      )}
    </Router>
  )
}

export default App