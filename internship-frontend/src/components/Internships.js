// src/components/Internships.js

import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * Internships Component
 * - Fetches and displays a grid of internship opportunities.
 * - Uses custom card styling and responsive Bootstrap grid.
 * - Shows position, company, description, and a View button for details.
 *
 * Props:
 * - studentView [boolean]: may be used to adjust display/features for student role.
 */
export default function Internships({ studentView = false }) {
  // ---------- State management ----------
  // Array of internship objects fetched from backend
  const [list, setList] = useState([]);
  // Error string in case of failed API call
  const [err, setErr] = useState('');

  // ---------- Data loading: useEffect ----------
  /**
   * Loads internship list from backend when component mounts.
   * - Uses GET /internships endpoint.
   * - Stores result in state 'list', sets error if request fails.
   * - Defensive for both res.data.data and res.data API shapes.
   */
  useEffect(() => {
    api.get('/internships')
      .then(res => setList(res.data.data || res.data))
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load internships'));
  }, []);

  // ---------- UI rendering and layout ----------
  /**
   * Displays:
   * - Section heading (centered, stylized)
   * - Alert if error loading data
   * - Fallback for no internships found
   * - Bootstrap responsive grid of internship cards (3 col on md+, 2 col on sm)
   *    - Card: role, company, description, button for view, accent corner bubble
   */
  return (
    <div className="container py-5">
      {/* Stylish dashboard section title */}
      <h1 className="dash-section-title text-center mb-5">Internships</h1>
      {/* Render error alert if API call fails */}
      {err && <div className="alert alert-danger">{err}</div>}
      {/* Show fallback message if internships list is empty and no error */}
      {list.length === 0 && !err && <div className="text-white">No internships available.</div>}
      
      {/* Responsive grid: Bootstrap row, multiple columns per screen size */}
      <div className="row gx-4 gy-4">
        {list.map(item => (
          // Individual internship card mapped per item
          <div className="col-md-4 col-sm-6" key={item._id}>
            {/* Card shows most useful info and includes gradient styling, shadow, accent */}
            <div
              className="internship-card shadow-lg d-flex flex-column justify-content-between h-100"
              style={{
                background: 'linear-gradient(120deg,#25334D 75%,#37b6ff22 100%)',
                borderRadius: '22px',
                padding: '2rem 1.5rem',
                color: '#eef6ff',
                minHeight: '230px',
                transition: 'transform 0.22s, box-shadow 0.22s',
                boxShadow: '0 5px 24px rgba(33,72,150,0.16)',
                position: 'relative',
              }}
              // Card interaction: slight scale/shine on mouse hover for better UX
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.025)';
                e.currentTarget.style.boxShadow = '0 10px 36px rgba(33,150,243,0.21)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 5px 24px rgba(33,72,150,0.16)';
              }}
            >
              {/* Card top: Internship position/job title */}
              <div>
                <h5 style={{
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 7,
                  textShadow: '0 2px 10px #234'
                }}>
                  {item.position}
                </h5>
                {/* Company name prominently below position */}
                <span style={{
                  color: '#9ad1ff',
                  fontWeight: 500,
                  fontSize: '1rem',
                  marginBottom: 5,
                  display: 'block'
                }}>
                  {item.companyId?.name}
                </span>
                {/* Internship description, max 120 chars, fallback if not provided */}
                <p style={{
                  margin: '6px 0 18px',
                  color: '#cbeffe',
                  fontSize: '0.98rem'
                }}>
                  {item.description?.slice(0, 120) || 'No description provided.'}
                </p>
              </div>
              {/* Card bottom: View button (future details functionality) */}
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-outline-info btn-sm px-4"
                  style={{ borderRadius: '7px' }}
                  // You can implement modal or details logic here
                >
                  View
                </button>
              </div>
              {/* Decorative: accent color bubble in card corner */}
              <div
                style={{
                  position: 'absolute',
                  top: 16, right: 20,
                  background: 'radial-gradient(circle,#37b6ff44 40%,transparent 70%)',
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
- Efficient async GET call loads internships; errors shown in Bootstrap alert.
- Responsive grid, modern card UI with gradients, shadow, hover effects.
- Each card separates role, company, description, action button, and accent.
- Extensible: modal integration, filter/search sort, admin CRUD actions.
- Accessible: headline role, high contrast, semantic and responsive layout.
- Defensive for API shape differences (data.data vs data).
=====================================================================
*/
