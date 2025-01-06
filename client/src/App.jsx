import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";

// You might want to add this simple Home component
const Home = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Welcome to RatLink
      </h1>
      <div className="space-y-4">
        <a
          href="/auth/twitter"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
        >
          <i className="fab fa-twitter mr-2"></i>
          Login with Twitter
        </a>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<EditProfile />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
