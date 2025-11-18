// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SplashScreen from "./components/SplashScreen";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Footer from "./components/Footer";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Settings from "./pages/Setting";
import Report from "./pages/Reports";
import Transactions from "./pages/Transaction";

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  console.log(user)

  // Handle splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Clean up on unmount
  }, []);

    const [darkMode, setDarkMode] = useState(() => {
    // Get from localStorage or default to false
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);


  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} />

      <main className="flex-grow-1 p-4">
        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/transactions" element={ user ? <Transactions user={user}/> : <Navigate to="/login" />} />
          <Route
            path="/report"
            element={user ? <Report /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />

          <Route
            path="/settings"
            element={
              user ? (
                <div className={`${darkMode ? "dark" : ""}`}>
                  <Settings darkMode={darkMode} toggleTheme={toggleTheme} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  </Router>
  );
}

export default App;
