import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FormPage from "./pages/FormPage";
import ProPage from "./pages/ProPage";
import ProFormPage from "./pages/ProFormPage";
import SharePage from "./pages/SharePage";
import DashboardPage from "./pages/DashboardPage";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-inter">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/form" element={<FormPage />} />
              <Route path="/pro" element={<ProPage />} />
              <Route path="/pro/form" element={<ProFormPage />} />
              <Route path="/card/:id" element={<SharePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
