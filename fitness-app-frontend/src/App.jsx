import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import SiteLayout from "./components/SiteLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Recommendations from "./pages/Recommendations";
import LoginPage from "./pages/LoginPage";

const ActvitiesPage = () => {
  const location = useLocation()
  useEffect(() => {
    if (location.hash === '#add-activity') {
      const el = document.getElementById('add-activity')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
  
  useEffect(() => {
    if (token) {
      dispatch(setCredentials({token, user: tokenData}));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <SiteLayout isAuthenticated={false}>
          <LoginPage onLogin={logIn} />
        </SiteLayout>
      ) : (
        <SiteLayout isAuthenticated={true} onLogout={logOut}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activities" element={<ActvitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/profile" element={<Profile user={tokenData} />} />
            <Route path="/" element={<Navigate to="/dashboard" replace/>} />
            <Route path="*" element={<Navigate to="/dashboard" replace/>} />
          </Routes>
        </SiteLayout>
      )}
    </Router>
  )
}

export default App