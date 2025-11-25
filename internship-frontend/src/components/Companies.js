// src/components/Companies.js

import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * Companies Component
 * - Displays a grid of company profiles (location, site, HR contact, description).
 * - Loads company data from backend API on mount.
 * - Includes error handling, responsive layout, and modern card styling.
 */
export default function Companies() {
  // ------------------ State management ------------------
  // Array of company objects fetched from backend
  const [list, setList] = useState([]);
  // Error string for API failure (network/server errors)
  const [err, setErr] = useState('');

  // ------------------ Data loading: useEffect ------------------
  /**
   * Fetches companies list from server when component mounts.
   * Uses GET /companies endpoint.
   * Updates 'list' state or renders error on problem.
   */
  useEffect(() => {
    api.get('/companies')
      .then(res => setList(res.data.data || res.data)) // Supports res.data.data or res.data API formats
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load companies'));
  }, []);

  // ------------------ Render Logic & Layout ------------------
  /**
   * UI includes:
   * - Section heading (dashboard stylized)
   * - Alert for error states
   * - Fallback for no companies present
   * - Responsive Bootstrap grid (2 col on md, 1 col on sm)
   * - Modern cards showing company info and HR contact
   */
  return (
    <div className="container py-5">
      {/* Dashboard-style section title */}
      <h1 className="dash-section-title text-center mb-5">Companies</h1>
      {/* Error alert if data fails to load */}
      {err && <div className="alert alert-danger">{err}</div>}
      {/* No companies fallback if list empty and no error */}
      {list.length === 0 && !err && <div className="text-white text-center">No companies found</div>}
      
      {/* Responsive companies grid: 2 columns on md+, 1 on sm */}
      <div className="row gx-4 gy-4">
        {list.map(c => (
          // Company info card
          <div className="col-md-6" key={c._id}>
            <div
              className="small-card d-flex justify-content-between align-items-start p-4"
              style={{
                background: 'linear-gradient(135deg, #1b2437 75%, #2a7b81cc 100%)',
                borderRadius: '22px',
                boxShadow: '0 8px 30px rgba(20,50,70,0.25)',
                color: '#e0f5ff',
                minHeight: '150px'
              }}
            >
              {/* Main company info: name (heading), location, website, description */}
              <div style={{ maxWidth: '68%' }}>
                {/* Prominent company name, headline style */}
                <h4 style={{
                  marginBottom: '6px',
                  fontWeight: '700',
                  color: '#dbeeff',
                  textShadow: '0 2px 12px #1a2b44'
                }}>
                  {c.name}
                </h4>
                {/* Location and website, compact, muted color */}
                <p style={{
                  margin: 0,
                  fontWeight: '600',
                  color: '#a3d2ff'
                }}>
                  {c.location} • {c.website}
                </p>
                {/* Short company description, fallback if missing */}
                <p style={{
                  marginTop: 7,
                  color: '#c2e7ff',
                  lineHeight: '1.3'
                }}>
                  {c.description || 'No description available.'}
                </p>
              </div>
              {/* HR contact info: right-aligned, dedicated area */}
              <div style={{ textAlign: 'right', minWidth: 130 }}>
                {/* HR contact name, fallback to "N/A" */}
                <div style={{
                  fontWeight: '600',
                  color: '#91d5f9',
                  marginBottom: 4
                }}>
                  HR: {c.hrContact?.name || 'N/A'}
                </div>
                {/* Email as clickable mailto link, breaks long addresses */}
                <a href={`mailto:${c.email}`}
                   style={{
                     color: '#79c0ff',
                     textDecoration: 'underline',
                     fontSize: '0.95rem',
                     wordBreak: 'break-all'
                   }}>
                  {c.email}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
================== COMPONENT DOCS & DESIGN NOTES ====================
- Loads company data via API, async GET pattern with useEffect.
- Clear, semantic layout: section headings, error alerts, empty fallback.
- Modern dashboard UI: gradient cards, shadow, border radius, split info layout.
- HR section is right-aligned; makes contact info highly visible.
- Extensible: supports editing (admin), more details, images/logos, external links.
- Accessible: clear titles, readable colors, clickable contact, responsive grid.
=====================================================================
*/
