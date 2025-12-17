import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const ActvitiesPage = () => {
  return (<Box sx={{ p: 2, border: '1px dashed grey' }}>
    <ActivityForm onActivitiesAdded = {() => window.location.reload()} />
    <ActivityList />
  </Box>);
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
      <div className="app-shell">
        <div className="app-container">
          {!token ? (
            <div className="max-w-xl mx-auto text-center py-24 px-6 bg-black/30 rounded-xl shadow-lg backdrop-blur-sm">
              <h1 className="text-3xl font-semibold mb-3">Welcome to FitTrack</h1>
              <p className="text-sm text-gray-300 mb-6">Securely track workouts, get AI-driven recommendations, and manage your profile.</p>
              <div className="flex justify-center">
                <button onClick={() => logIn()} className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-6 py-3">Sign in</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={logOut} className="bg-neutral-800 text-white px-3 py-1 rounded">Logout</button>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <Routes>
                  <Route path="/activities" element={<ActvitiesPage />}/>
                  <Route path="/activities/:id" element={<ActivityDetail />}/>
                  <Route path="/" element={token ? <Navigate to="/activities" replace/> : <div>Welcome! Please Login.</div>} />
                </Routes>
              </div>
            </div>
          )}
        </div>
      </div>
    </Router>
  )
}

export default App