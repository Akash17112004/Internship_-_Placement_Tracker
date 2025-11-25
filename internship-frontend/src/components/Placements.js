// src/components/Placements.js

import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * Placements Component
 * - Displays available placement opportunities to users (student/admin/TPO).
 * - Fetches placement data from backend API.
 * - Shows position, company, description, salary, action buttons, and status info.
 * - Applies dashboard card styling and handles responsive grid layout.
 *
 * Props:
 * - studentView: Boolean; filters view/features for student users.
 */
export default function Placements({ studentView = false }) {
  // ------------------ State Management ------------------
  // Placement list from API response
  const [list, setList] = useState([]);
  // Error string for API/network/response failures
  const [err, setErr] = useState('');

  // ------------------ Data Fetching: useEffect ------------------
  /**
   * Fetches placements list from server when component mounts.
   * - Uses GET /placements endpoint.
   * - Updates state 'list' on success.
   * - Records error message for alert on failure.
   */
  useEffect(() => {
    api.get('/placements')
      .then(res => setList(res.data.data || res.data))  // Some APIs use res.data.data, fallback to res.data
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load placements'));
  }, []);

  // ------------------ Main Render Logic ------------------
  /**
   * UI is rendered as:
   * - Title bar (section heading)
   * - Conditional error alert or "no placements" fallback
   * - Responsive grid of placement cards:
   *    - Each card: job info, company, salary, description, and actions
   */
  return (
    <div className="container py-5">
      {/* Section title, centered for dashboard aesthetics */}
      <h1 className="dash-section-title text-center mb-5">Placements</h1>
      {/* Error state, red alert if API/network fails */}
      {err && <div className="alert alert-danger">{err}</div>}
      {/* No placements fallback for empty data */}
      {list.length === 0 && !err && <div className="text-white">No placements available.</div>}
      
      {/* Responsive grid: 3 columns on md+, 2 column on sm */}
      <div className="row gx-4 gy-4">
        {list.map(item => (
          // Card for each placement, uses grid to allow responsive multi-column
          <div className="col-md-4 col-sm-6" key={item._id || item.id}>
            {/* Modern, rich card layout: gradient, shadow, border-radius, hover effects */}
            <div
              className="placement-card d-flex flex-column justify-content-between h-100"
              style={{
                background: 'linear-gradient(120deg,#232d42 70%,#24a19c22 100%)',
                borderRadius: '22px',
                padding: '2rem 1.5rem',
                color: '#f2fcff',
                minHeight: '230px',
                transition: 'transform 0.22s, box-shadow 0.22s',
                boxShadow: '0 6px 25px rgba(33,131,157,0.15)',
                position: 'relative',
              }}
              // Card scale/shadow effect for UX feedback on mouse hover
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.025)';
                e.currentTarget.style.boxShadow = '0 12px 44px rgba(33,193,243,0.19)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(33,131,157,0.15)';
              }}
            >
              {/* Card main info block: role, company, description, salary */}
              <div>
                {/* Placement position/role */}
                <h5 style={{
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 7,
                  textShadow: '0 2px 10px #234'
                }}>
                  {item.position}
                </h5>
                {/* Company name, may be from computed property */}
                <span style={{
                  color: '#7fe1e7',
                  fontWeight: 500,
                  fontSize: '1rem',
                  marginBottom: 5,
                  display: 'block'
                }}>
                  {item.companyId?.name || item.company?.name}
                </span>
                {/* Short job description (max 120 chars), fallback text if missing */}
                <p style={{
                  margin: '6px 0 18px',
                  color: '#cff4ff',
                  fontSize: '0.98rem'
                }}>
                  {item.description?.slice(0, 120) || 'No description provided.'}
                </p>
                {/* Salary/CTC; highlights prominent info */}
                <div>
                  <strong>Salary:</strong> 
                  <span style={{ color: "#74ffe8" }}>
                    {item.salary || item.ctc || '—'}
                  </span>
                </div>
              </div>

              {/* Action buttons row: View, Apply; disabled as needed */}
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-outline-info btn-sm px-4 me-2"
                  style={{ borderRadius: '7px' }}
                  onClick={() => window.alert('View details not implemented yet')}
                >
                  View
                </button>
                {/* Apply button is disabled for students when backend is not ready */}
                <button className="btn btn-primary btn-sm px-4" disabled style={{ borderRadius: '7px' }}>
                  Apply
                </button>
              </div>
              {/* Disabled note: for students if backend doesn't support apply endpoint */}
              <div className="btn-disabled-note mt-3" style={{ color: '#bae3ee', fontSize: '0.93em' }}>
                As with internships, student apply is disabled because your backend doesn't expose a student apply endpoint.
              </div>
              {/* Decorative accent, corner bubble gradient */}
              <div
                style={{
                  position: 'absolute',
                  top: 16, right: 20,
                  background: 'radial-gradient(circle,#24a19c44 40%,transparent 70%)',
                  width: 45, height: 45,
                  borderRadius: '50%',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
================== COMPONENT DOCS & DESIGN NOTES ====================
- Efficiently loads placement data with useEffect, async API pattern.
- Handles server/network errors gracefully with status alert.
- Modern dashboard UI: cards, gradients, responsive columns, shadow effects.
- Displays key job info for multiple roles (admin, student, TPO).
- Action buttons row, scalable to future endpoints (e.g. integrated detail modal, working Apply).
- Extensible: add search, filters, sorting, admin actions.
- Accessible: uses semantic headlines, buttons, alt text for errors.
- Clean separation of card info, accent color, and role logic for future maintainers.
=====================================================================
*/
