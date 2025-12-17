import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import SiteLayout from "./components/SiteLayout";
import ActivitySummary from "./components/ActivitySummary";
import ActivityChart from "./components/ActivityChart";

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
          <div className="max-w-3xl mx-auto text-center py-24 px-6 bg-black/30 rounded-xl shadow-lg backdrop-blur-sm">
            <h1 className="text-4xl font-semibold mb-3">Welcome to FitTrack</h1>
            <p className="text-base text-gray-300 mb-6">Track workouts, get AI recommendations, and monitor progress across devices.</p>
            <div className="flex justify-center">
              <button onClick={() => logIn()} className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-6 py-3">Sign in</button>
            </div>
          </div>
        </SiteLayout>
      ) : (
        <SiteLayout isAuthenticated={true} onLogout={logOut}>
          <div className="space-y-6">
            <ActivitySummary />
            <ActivityChart />
            <Routes>
              <Route path="/activities" element={<ActvitiesPage />}/>
              <Route path="/activities/:id" element={<ActivityDetail />}/>
              <Route path="/" element={<Navigate to="/activities" replace/>} />
            </Routes>
          </div>
        </SiteLayout>
      )}
    </Router>
  )
}

export default App