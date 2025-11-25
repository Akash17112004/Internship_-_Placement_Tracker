// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * Register Component
 * - Renders a registration form for new users (students, TPO, admin).
 * - Handles submission to backend via /auth/register.
 * - Returns authentication token and user info to parent handler on success.
 *
 * Props:
 * - onRegister: function(token, user) provided by App.js for session management.
 */
export default function Register({ onRegister }) {
  // ------------------ Controlled input states ------------------
  // Individual fields tied to user input
  const [email, setEmail] = useState('');       // Email address
  const [password, setPassword] = useState(''); // Account password
  const [name, setName] = useState('');         // Full name
  const [rollNo, setRollNo] = useState('');     // Roll number (students only)
  const [role, setRole] = useState('student');  // Role selector; default "student"
  const [err, setErr] = useState('');           // Error message for registration issues

  // React Router navigation object to redirect after registration
  const navigate = useNavigate();

  // ------------------ Form submission logic ------------------
  /**
   * Handles registration form submission.
   * - Prevents page reload.
   * - Sends POST request to backend with collected user info.
   * - On success:
   *   - Calls parent handler to update session
   *   - Stores user info locally
   *   - Navigates to dashboard/home
   * - On error:
   *   - Displays backend-provided (or fallback) error message
   */
  const submit = async (e) => {
    e.preventDefault();
    setErr(''); // Clear previous errors

    try {
      // Send user info to backend; expects token and user object
      const res = await api.post('/auth/register', { email, password, role, name, rollNo });
      const { token, user } = res.data;
      // Call parent handler with new login info
      onRegister(token, { id: user.id, email: user.email, role: user.role });
      // Optional: save user locally for quick session hydration
      localStorage.setItem('user', JSON.stringify({ id: user.id, email: user.email, role: user.role }));
      // Redirect user to dashboard
      navigate('/');
    } catch (error) {
      // Display API/server error to user, or fallback message
      setErr(error?.response?.data?.message || 'Registration failed');
    }
  };

  // ------------------ Render registration form ------------------
  // Responsive container, Bootstrap styling, glass effect
  return (
    <div className="glass-card login-transparent">
      {/* Section title */}
      <h4 className="mb-3">Create account</h4>

      {/* Error display, only renders if non-empty */}
      {err && <div className="alert alert-danger">{err}</div>}

      {/* Form fields and submit button */}
      <form onSubmit={submit}>
        {/* Name */}
        <div className="mb-2">
          <label className="form-label">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}   // Controlled input
            className="form-control"
            required                                    // Makes field mandatory
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="form-control"
            type="email"
            required
            autoComplete="username"
          />
        </div>

        {/* Roll Number -- visible for all roles */}
        <div className="mb-2">
          <label className="form-label">Roll No (students)</label>
          <input
            value={rollNo}
            onChange={e => setRollNo(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input
            value={password}
            type="password"
            onChange={e => setPassword(e.target.value)}
            className="form-control"
            required
            autoComplete="new-password"
          />
        </div>

        {/* Role Selector: student, TPO, admin */}
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="tpo">TPO</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit button */}
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}

/*
======================= COMPONENT DOCS ======================
- Registration form for any role: student, TPO, admin
- Controlled input fields for best UX and validation
- POSTs all user info to backend, error handling displays helpful messages
- Responsive "glass card" appearance via Bootstrap and custom CSS
- Automatically logs in user on success and navigates to dashboard
- Easily extensible: add more fields, integrate password strength, invite codes, etc.
=============================================================
*/
