import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './config/router';
import './style.css';
import { OpenAPI } from './api/generated';

// Set the base URL for the API client
OpenAPI.BASE = 'https://localhost:7194';

// Check for auth token on startup
const token = localStorage.getItem('authToken');
if (token) {
  OpenAPI.TOKEN = token;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
