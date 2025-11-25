// src/components/Applications.js
import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * Applications Component
 * - Displays all internship/placement applications for admin/TPO view.
 * - Shows student name, target position, application status, actions to approve/reject.
 * - Loads applications list from backend, includes error handling and responsive design.
 */
export default function Applications() {
  // ------------------ State management ------------------
  // Applications list from API
  const [apps, setApps] = useState([]);
  // Error string for server/network problems
  const [err, setErr] = useState('');

  // ------------------ Async data loading logic ------------------
  /**
   * Loads the applications list when component mounts.
   * - Calls GET /applications
   * - Updates local state or displays error on failure
   */
  const load = () => {
    api.get('/applications')
      .then(res => setApps(res.data.data || res.data)) // Support different backend API shapes
      .catch(e => setErr(e?.response?.data?.message || 'Failed to load applications'));
  };

  // Run data load exactly once when component is first rendered
  useEffect(() => { load(); }, []);

  // ------------------ Approve/Reject Handlers ------------------
  /**
   * Approve/reject actions call PUT endpoint on specific application.
   * - On success, reloads list so UI remains up-to-date.
   * - Could expand logic to handle loading states, error splash, or confirmation dialogs.
   */
  const approve = (id) => {
    api.put(`/applications/${id}/approve`).then(load);
  };

  const reject = (id) => {
    api.put(`/applications/${id}/reject`).then(load);
  };

  // ------------------ UI rendering ------------------
  /**
   * Dashboard-style section heading
   * Error alert if network/server issues
   * Fallback message if no applications found
   * Responsive grid of application cards:
   *  - Each card displays applicant, position, status, applied date, action buttons
   *  - Status color coding, easy approve/reject update for admins
   */
  return (
    <div className="container py-5">
      {/* Dashboard section heading */}
      <h1 className="dash-section-title text-center mb-5">Applications</h1>
      {/* Error alert, displayed only on data loading failure */}
      {err && <div className="alert alert-danger">{err}</div>}
      {/* "No applications found" fallback if data is empty */}
      {apps.length === 0 && !err && <div className="text-white text-center">No applications found</div>}
      
      {/* Responsive grid: Bootstrap row, 2 columns on large screens */}
      <div className="row gx-4 gy-4">
        {apps.map(a => (
          <div className="col-lg-6" key={a._id}>
            {/* Modern card: flex row, summary on left, actions on right, gradient style */}
            <div
              className="small-card d-flex justify-content-between align-items-center p-4"
              style={{
                background: 'linear-gradient(120deg,#292e39 77%,#37b6ff22 100%)',
                borderRadius: '20px',
                boxShadow: '0 7px 28px rgba(44,114,177,0.18)',
                color: '#e5f5ff',
                minHeight: '140px'
              }}
            >
              {/* Card info: student, job, status, applied timestamp */}
              <div>
                {/* Student name & job; arrow separator */}
                <div style={{ fontWeight: '700', fontSize: '1.08rem', color: '#aef6ff' }}>
                  {a.student?.name}
                  <span style={{ color: '#8cedc0', fontWeight: '500', margin: '0 8px' }}>→</span>
                  <span style={{ color: '#e0eaff', fontWeight: '600' }}>
                    {a.internship?.position || a.placement?.position}
                  </span>
                </div>
                {/* Application status, color-coded for quick review */}
                <div style={{ marginTop: 5, fontWeight: '500', color: '#8adcec', fontSize: '0.97rem' }}>
                  Status:{' '}
                  <span style={{
                    fontWeight: '700',
                    color:
                      a.status === 'pending' ? '#ffe096' :
                      a.status === 'approved' ? '#42de7c' : '#ff6868',
                    padding: '3px 10px',
                    borderRadius: '7px',
                    background:
                      a.status === 'pending' ? '#323745' :
                      a.status === 'approved' ? '#233b2a' : '#462327'
                  }}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </div>
                {/* Applied timestamp (formatted for locale) */}
                <div style={{ marginTop: 4, color: '#d6f3fd', fontSize: '0.93rem' }}>
                  Applied: {new Date(a.appliedAt).toLocaleString()}
                </div>
              </div>
              {/* Action buttons: Approve/Reject for pending, status for processed */}
              <div className="d-flex flex-column align-items-end gap-2">
                {a.status === 'pending' ? (
                  <>
                    <button className="btn btn-success btn-sm px-4"
                      style={{ borderRadius: 8, marginBottom: 4 }}
                      onClick={() => approve(a._id)}>
                      Approve
                    </button>
                    <button className="btn btn-danger btn-sm px-4"
                      style={{ borderRadius: 8 }}
                      onClick={() => reject(a._id)}>
                      Reject
                    </button>
                  </>
                ) : (
                  <span style={{
                      fontWeight: '700',
                      color: a.status === 'approved' ? '#42de7c' : '#ff6868',
                      fontSize: '1.01rem'
                    }}>
                    {a.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
======================= COMPONENT DOCS & NOTES ======================
- Async data load on mount, error handling via alert.
- Responsive grid: each row has up to two cards on large screens.
- Modern card style, color-coded for review actions/status.
- Approve/reject handlers update backend and refresh UI for immediate feedback.
- Easily includes more status (interviewed, rejected, accepted), batch actions, filtering, search.
- Extensible: scalable and readable for large application data sets.
=====================================================================
*/
