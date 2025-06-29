import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://i.ibb.co/WWHYcYDT/logo.png"
              alt="HypeCard Logo"
              width={50}
              height={50}
            />
            <span className="text-xl font-bold">HypeCard</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-muted hover:text-white transition-colors"
            >
              Home
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="text-muted hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/pro"
              className="text-muted hover:text-white transition-colors"
            >
              Pro
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
