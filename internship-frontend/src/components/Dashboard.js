// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * Dashboard Component
 * - Displays summary statistics for Students, Companies, Internships, Placements.
 * - Loads analytics data from backend on mount.
 * - Renders dashboard cards in a responsive Bootstrap grid.
 */
export default function Dashboard() {
  // ---------- State Hooks ----------
  // Stores stats object from API (counts for each domain area)
  const [stats, setStats] = useState(null);

  // ---------- Data Loading: useEffect ----------
  /**
   * Loads general analytics for dashboard when the component mounts.
   * - API GET to /analytics/dashboard.
   * - On success, sets stats with key counts.
   * - On failure (network, backend), sets stats to null (triggers loading state or fallback).
   */
  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(res => setStats(res.data.data))
      .catch(() => setStats(null));   // Could display error message for better UX
  }, []);

  // ---------- Loading/Fallback Logic ----------
  /**
   * If stats is not yet loaded (null), display "Loading" splash.
   * This provides the user feedback for slow network or server startup.
   */
  if (!stats)
    return <h4 className="text-white">Loading dashboard...</h4>;

  // ---------- Main Render Area ----------
  /**
   * Shows dashboard summary in 4 cards using Bootstrap grid utilities.
   * - Each col-md-3 cell gets one card with category and count.
   * - Cards use bg-dark for separation; can theme for light/dark as needed.
   */
  // src/components/Dashboard.js
return (
  <div className="row text-white">
    <div className="col-md-3">
      <div className="card p-3 bg-dark text-white mb-3">
        Students: {stats.totalStudents}
      </div>
    </div>
    <div className="col-md-3">
      <div className="card p-3 bg-dark text-white mb-3">
        Companies: {stats.totalCompanies}
      </div>
    </div>
    <div className="col-md-3">
      <div className="card p-3 bg-dark text-white mb-3">
        Internships: {stats.totalInternships}
      </div>
    </div>
    <div className="col-md-3">
      <div className="card p-3 bg-dark text-white mb-3">
        Placements: {stats.totalPlacements}
      </div>
    </div>
    {/* Optionally display placed students/placement rate */}
    {/* <div className="col-md-3">
      <div className="card p-3 bg-dark text-white mb-3">
        Placed Students: {stats.placedStudents}
      </div>
    </div>
    <div className="col-md-3">
      <div className="card p-3 bg-dark text-white mb-3">
        Placement Rate: {stats.placementRate}
      </div>
    </div> */}
  </div>
);

}

/*
======================= COMPONENT DOCUMENTATION ======================
- Efficiently loads analytics summary on mount (useEffect, API GET).
- All error handling is user-friendly; can add further error splash if desired.
- Responsive grid: 4 summary highlights (students, companies, etc.).
- Semantic layout: heading (category), count (number).
- Extensible: add more analytics, graphs, sparkline trends, or link cards.
- Accessible: large font, readable in all themes, clear separation per domain.
======================================================================
*/
