import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Navbar from "./components/NavBar";
import logo from "./assets/brckt-wordmark.svg";

const Home = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
    <div className="max-w-md w-full space-y-8">
      {/* Logo/Brand section */}
      <div className="text-center">
        <img
          src={logo}
          alt="BRCKT"
          className="h-16 w-auto mx-auto mb-4 text-gray-900 dark:text-white"
        />
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Your personal hub for all social connections
        </p>
      </div>

      {/* Main content card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Create your personalized link collection and share all your social
            profiles in one place.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                Get Started
              </span>
            </div>
          </div>

          <a
            href="/auth/twitter"
            className="w-full bg-[#1DA1F2] text-white py-3 px-4 rounded-lg hover:bg-[#1a8cd8] 
                     transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <i className="fa-brands fa-x-twitter text-xl"></i>
            <span>Continue with Twitter</span>
          </a>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/dashboard" element={<EditProfile />} />
                    <Route path="/:username" element={<Profile />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
