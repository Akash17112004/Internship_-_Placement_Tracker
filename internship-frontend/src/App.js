// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// ----------- Import shared API instance and all main components -----------
import api from './api';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Internships from './components/Internships';
import Placements from './components/Placements';
import Companies from './components/Companies';
import Students from './components/Students';
import Applications from './components/Applications';
import './App.css';

// ------------- Custom NavLink: Steamlined Navigation Tab -------------
/**
 * A helper for navigation links that supports
 * - Current page highlighting (active underline/color)
 * - Inline style for quick feedback (and easier modifications)
 * - Accessibility: aria-current page property
 */
function NavLink({ to, label }) {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  return (
    <Link
      to={to}
      className="dashboard-navbar-link"
      style={{
        color: isActive ? "#41c9ff" : "#e5eaf8",
        background: isActive ? "rgba(54,180,255,0.14)" : "transparent",
        fontWeight: isActive ? 700 : 500,
        borderRadius: "12px",
        padding: "8px 16px",
        marginRight: "4px",
        position: "relative",
        transition: "all .18s",
        borderBottom: isActive ? "3px solid #41c9ff" : "3px solid transparent",
        boxShadow: isActive ? "0 2px 8px #59e8ff33" : "none"
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  );
}

// --------------------- Main Application Component ---------------------
/**
 * The root of the SPA, manages:
 * - Session/auth state (localStorage)
 * - Navbar/branding and conditional navigation by role
 * - Content routing (dashboard, features)
 * - Handles login/logout and session bootstrapping
 */
export default function App() {
  // -- Authentication/session state; managed locally,
  //    persistent in localStorage for auto-reload login
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [me, setMe] = useState(null);

  // -- Effect: When user logs in/logs out, re-hydrate all user/session info from storage
  useEffect(() => {
    if (!token) return;
    const savedRole = localStorage.getItem('role');
    if (savedRole) setRole(savedRole);
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (savedUser) setMe(savedUser);
  }, [token]);

  // -- Login: Store credentials, then update state. Used by <Login>, <Register>
  const handleLogin = (tokenValue, userObj) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('role', userObj.role);
    localStorage.setItem('user', JSON.stringify(userObj));
    setToken(tokenValue);
    setRole(userObj.role);
    setMe(userObj);
  };

  // -- Logout: Clear credentials, go to login.
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setToken(null);
    setRole(null);
    setMe(null);
    window.location.href = '/login'; // Simple client-side redirect
  };

  // ----------- LOGIN/REGISTER ROUTING (not authenticated) -----------
  /**
   * Renders a vertically centered login/register card,
   * with the app title visible even before login (for strong branding).
   * Navigation handled by <Routes>; unknown paths default to /login.
   */
  if (!token) {
    return (
      <Router>
        <div className="dashboard-bg login-bg d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
          {/* App Title: always visible on login/register */}
          <div className="my-4">
            <h1
              style={{
                color: "#fff",
                fontWeight: 700,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '2.3rem',
                letterSpacing: '.5px',
                textShadow: '0 3px 16px #111, 0 2px 10px #22caff'
              }}
            >
              Internship & Placement Tracker
            </h1>
          </div>
          {/* Login or Register form */}
          <div style={{ maxWidth: 420, width: '92%' }}>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onRegister={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }

  // ----------- MAIN DASHBOARD: Rendered When Logged In -----------
  /**
   * Renders the dashboard interface with:
   * - Sticky navbar: branding, role label, tab navigation, and logout
   * - Role-based tab visibility (Students, Applications for admin/TPO)
   * - All routed feature modules (Company, Internship, Placement, etc.)
   * - Unknown paths default to main page per role
   */
  return (
    <Router>
      <div className="dashboard-bg">
        <div className="container">
          {/* ========== NAVBAR: Brand + Navigation + Logout ========== */}
          <header
            className="dashboard-navbar"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 30,
              background: 'rgba(24, 28, 37, 0.76)',
              backdropFilter: 'blur(8px) saturate(122%)',
              borderBottom: '1px solid #242c37',
              boxShadow: '0 2px 18px rgba(0,0,0,0.12)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between container py-2">
              {/* Branding and user role display */}
              <div className="d-flex flex-column">
                <h3 style={{
                  margin: 0,
                  color: "#b6e2f8",
                  letterSpacing: '1px',
                  fontWeight: 700,
                  fontSize: '2rem',
                  textShadow: '0 2px 18px #192642',
                  fontFamily: 'Montserrat, sans-serif'
                }}>
                  Internship & Placement Tracker
                </h3>
                <small style={{
                  opacity: 0.87,
                  color: "#84b6ff",
                  fontWeight: 600,
                  fontSize: '1.07rem',
                  marginTop: 2
                }}>
                  {role ? role.toUpperCase() : ''}
                </small>
              </div>
              {/* Navbar: main tabs by feature, with role-restricted entries */}
              <nav className="dashboard-nav d-flex align-items-center">
                <NavLink to="/" label="Home" />
                <NavLink to="/internships" label="Internships" />
                <NavLink to="/placements" label="Placements" />
                <NavLink to="/companies" label="Companies" />
                {role === 'admin' && <NavLink to="/students" label="Students" />}
                {['admin', 'tpo'].includes(role) && <NavLink to="/applications" label="Applications" />}
                {/* Logout (always last) */}
                <button
                  className="btn btn-gradient ms-2"
                  onClick={handleLogout}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '28px',
                    background: 'linear-gradient(90deg,#4468ca 0%,#4fd7ff 90%)',
                    color: '#fff',
                    boxShadow: '0 2px 14px #1e3254ab',
                    border: 'none',
                    fontWeight: '700',
                    letterSpacing: '.5px'
                  }}
                >
                  Logout
                </button>
              </nav>
            </div>
          </header>

          {/* Main content: role-based home route and main feature modules */}
          <div className="mt-4">
            <Routes>
              {/* Admin/TPO: Dashboard; Student: Internships */}
              {['admin', 'tpo'].includes(role) && (
                <Route path="/" element={<Dashboard />} />
              )}
              {role === 'student' && (
                <Route path="/" element={<Internships studentView />} />
              )}
              {/* All other feature pages */}
              <Route
                path="/internships"
                element={<Internships studentView={role === 'student'} />}
              />
              <Route
                path="/placements"
                element={<Placements studentView={role === 'student'} />}
              />
              <Route path="/companies" element={<Companies />} />
              {role === 'admin' && (
                <Route path="/students" element={<Students />} />
              )}
              {['admin', 'tpo'].includes(role) && (
                <Route path="/applications" element={<Applications />} />
              )}
              {/* Unknown route fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

/*
========================= PROJECT DOCUMENTATION ==========================
- This file is the main orchestration for your portal's frontend routing, branding,
  and persistent login/logout experience.
- Commented for clarity and collaboration: all design choices, role logic, feature structure.
- Designed for easy extension: add more modules/tabs/routes or UI/UX improvements as desired.
- Branding, navigation scheme, and conditional routing displayed on both auth and post-auth views.
- Follows modern React SPA principles with component modularity and separation of concerns.
=========================================================================
*/
