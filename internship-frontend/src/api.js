// src/api.js

import axios from 'axios';

/**
 * Main API module for all HTTP requests.
 * - Sets up an Axios instance with consistent base configuration.
 * - Handles default base URL, request timeout, and authentication token injection.
 * - Used across all components for backend communication.
 */

// ----------------- Axios Instance -----------------
/*
  Create a single Axios instance so every part of the app uses the same base config.
  - baseURL: Root for all requests, points to backend server.
  - timeout: Maximum time to wait for responses (in milliseconds).
*/
const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Change if your backend runs elsewhere
  timeout: 10000,                        // 10 seconds timeout for all requests
});

// ----------------- Auth Interceptor (Request) -----------------
/*
  Before every request, inject Authorization header if token exists.
  - Retrieves JWT token from localStorage (set on login).
  - Adds 'Authorization: Bearer <token>' header for backend authentication.
  - Patterns match typical REST API access control.
  - Error handler (second arg) simply passes error forward for further handling.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`; // Standard JWT pattern
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------- Export API Instance -----------------
/*
  Any file/component that needs to communicate with the backend
  should import this api instance and use its .get/.post/etc. methods.
*/
export default api;

/*
============================ API MODULE DOCS ============================
- All HTTP requests pass through this shared axios instance, ensuring
  consistent authentication and error handling.
- Interceptor logic means you don't have to add token manually in every request.
- Centralized timeout and baseURL setup avoids duplication and config errors.
- Easily extensible: add response interceptors, logging, global error handling.
- For deployment/production, baseURL should be changed to live backend endpoint.
- Can be enhanced with custom error, cache, or retry handling for larger projects.
=========================================================================
*/
