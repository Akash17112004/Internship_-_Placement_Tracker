// src/components/Students.js

import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * Students Component (Admin view)
 * - Fetches and displays list of students for admin role.
 * - Shows key info: name, roll number, email, GPA, department, total applications.
 * - Uses Bootstrap for grid responsive layout and custom card styling.
 */
export default function Students() {
  // ------------------ State Hooks ------------------
  // Stores array of student objects returned from backend
  const [list, setList] = useState([]);
  // Stores any error returned from API, used to populate alert
  const [err, setErr] = useState('');

  // ------------------ Load students from API on mount ------------------
  /**
   * useEffect runs on initial mount, triggers API GET to /students.
   * Updates state 'list' if call succeeds, or 'err' with error message if fails.
   * Error handling allows display of backend/server errors to user.
   */
  useEffect(() => {
    api.get('/students')
      .then(res => setList(res.data.data || res.data))  // Some backends wrap response in 'data.data'
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load students'));
  }, []);

  // ------------------ Render main UI ------------------
  // Bootstrap container and grid, conditional error and no-data states.
  return (
    <div className="container py-5">
      {/* Section title, visually prominent and centered */}
      <h1 className="dash-section-title mb-5 text-center">Students (Admin)</h1>

      {/* Error Alert, if any API failure or data issue */}
      {err && <div className="alert alert-danger">{err}</div>}
      {/* Display if no students found in database */}
      {list.length === 0 && !err && <div className="text-white text-center">No students found.</div>}

      {/* Students grid: responsive 2-column layout on 'md', 1-column on mobile */}
      <div className="row gx-4 gy-4">
        {list.map(s => (
          <div className="col-md-6" key={s._id || s.id}>
            {/* Student card
              - Shows all major info fields,
              - Custom gradient, shadow, border-radius for modern UI appearance
              - Responsive alignment (info left, applications right)
            */}
            <div
              className="small-card d-flex justify-content-between align-items-center p-4"
              style={{
                background: 'linear-gradient(135deg, #242a39 80%, #556a8d22 100%)',
                borderRadius: '20px',
                boxShadow: '0 6px 28px rgba(20,50,70,0.21)',
                color: '#e4f0ff',
                minHeight: '130px'
              }}
            >
              {/* Main info block: name, rollNo, email, GPA, department */}
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.18rem', color: '#c9e6ff', marginBottom: 6 }}>
                  {s.name}
                </div>
                <div style={{ color: '#8bbcf4', fontWeight: '600', marginBottom: 5 }}>
                  {s.rollNo}
                </div>
                <div style={{
                  fontSize: '0.96rem',
                  color: '#bae4ff',
                  marginBottom: 4
                }}>
                  {s.email}
                </div>
                <div style={{ color: '#d1edfa', fontSize: '0.98rem' }}>
                  {/* Show GPA and department, fallback to '—' if missing */}
                  GPA: <span style={{ fontWeight: '600' }}>{s.gpa ?? '—'}</span>
                  &nbsp;•&nbsp;Dept: <span style={{ fontWeight: '600' }}>{s.department ?? '—'}</span>
                </div>
              </div>
              {/* Right-aligned application count (internships + placements) */}
              <div style={{ textAlign: 'right', minWidth: 110 }}>
                <span style={{
                  color: '#8fe3e2',
                  fontWeight: '600',
                  fontSize: '1.05rem'
                }}>
                  Applications:&nbsp;
                  {/* Sum both internship and placement applications for total */}
                  {(s.appliedInternships?.length || 0) + (s.appliedPlacements?.length || 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
======================= COMPONENT DOCS ======================
- Fetches student data on mount (useEffect) from backend API.
- Error handling displays user-friendly alerts.
- Responsive grid layout, optimized for both wide screens and mobile.
- Custom card style using Bootstrap utility classes and inline gradient/shadow for dashboard look.
- Separates card info: left info, right applications (flexbox).
- Extensible: can add edit, delete, or details modal per student.
- Accessible: clear section titles, readable contrast, semantic structure.
=============================================================
*/
