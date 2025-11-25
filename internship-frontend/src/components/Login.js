import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * Login Component
 * - Renders a login form.
 * - Handles authentication via API call to backend.
 * - Displays errors and navigates to dashboard on successful login.
 *
 * Props:
 * - onLogin: function(token, user) provided by parent for session management on success.
 */
export default function Login({ onLogin }) {
  // -------------------- State management --------------------
  // User email input
  const [email, setEmail] = useState('');
  // User password input
  const [password, setPassword] = useState('');
  // Error message string; displayed above form on failure
  const [err, setErr] = useState('');
  // React Router navigation object for redirects
  const navigate = useNavigate();

  // -------------------- Form submission handler --------------------
  /**
   * Handles the login form submission.
   * - Prevents default form reload.
   * - Initiates API POST /auth/login with {email, password}.
   * - If successful:
   *    - Extracts token and user from backend response.
   *    - Calls onLogin prop handler to update parent state/session.
   *    - Redirects user to home/dashboard.
   * - If error:
   *    - Displays error message from backend (or generic fallback).
   */
  const submit = async e => {
    e.preventDefault();
    setErr(''); // Clear any previous error

    try {
      // Submit credentials to backend API
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      onLogin(token, user);    // Pass token and user up to App.js/main logic
      navigate('/');           // Redirect to dashboard/home after login
    } catch (error) {
      // Show server-provided error, or default 'Login failed'
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  // -------------------- Render Login Form and UI --------------------
  // - Responsive, glass-style card with Bootstrap styling.
  // - Displays any API/server errors.
  // - Links to register page for new users.
  return (
    <div className="login-card login-transparent p-5" style={{ maxWidth: "450px" }}>
      {/* Label/title for user */}
      <h2 className="text-white mb-4 fw-bold text-center">Login</h2>

      {/* Conditional error display on failed login */}
      {err && <div className="alert alert-danger w-100">{err}</div>}

      {/* Login credentials form (uses Bootstrap for layout/styling) */}
      <form onSubmit={submit} className="w-100">

        {/* Email input field */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control bg-dark text-white border-secondary"
            value={email}
            onChange={e => setEmail(e.target.value)}   // Update local state
            placeholder="Enter email"
            autoComplete="username"                    // Suggest for modern browsers
            required
          />
        </div>

        {/* Password input field */}
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control bg-dark text-white border-secondary"
            value={password}
            onChange={e => setPassword(e.target.value)} // Update local state
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
        </div>

        {/* Submit button: triggers form/submit handler */}
        <button className="btn btn-primary w-100 mb-3">Login</button>

        {/* Navigation link to registration for new users */}
        <Link to="/register" className="btn btn-outline-light w-100">
          Register
        </Link>

      </form>
    </div>
  );
}

/*
======================= COMPONENT NOTES =======================
- Encapsulates all login logic and UI (can be reused, extended).
- Handles error-prone async API logic gracefully; provides feedback.
- Clean separation of state, user input, error handling.
- Modern responsive/bootstrap look; can be themed further.
- Accessible: uses labels, placeholders, autoComplete, required attributes.
- Easily extensible: field validation, password reset, OAuth can be added.
===============================================================
*/
