import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/brckt-wordmark.svg";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = ({ isAuthenticated, username }) => {
  const { toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="BRCKT"
                className="h-8 w-auto text-gray-900 dark:text-white"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Toggle theme"
            >
              <i className="fas fa-moon dark:fa-sun"></i>
            </button>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
