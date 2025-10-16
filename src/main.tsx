import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './pages/App.tsx';
import LoginPage from './pages/LoginPage.tsx';
import TodoListPage from './pages/TodoListPage.tsx';
import WorkItemEditPage from './pages/WorkItemEditPage.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import './style.css';
import { OpenAPI } from './api/generated';
import setupAxiosInterceptor, { setNavigate } from './api/axiosInterceptor.ts';
import { authManager } from './services/authManager.ts';

// Set API base URL
OpenAPI.BASE = 'https://localhost:7194';

// Initial token setup
const { token } = authManager.getTokens();
if (token) {
  OpenAPI.TOKEN = token;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <TodoListPage />,
      },
    ],
  },
  {
    path: '/admin/work-items/new',
    element: (
      <AdminProtectedRoute>
        <WorkItemEditPage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: '/admin/work-items/:id/edit',
    element: (
      <AdminProtectedRoute>
        <WorkItemEditPage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

// Set the navigate function for the interceptor to use
setNavigate(router.navigate);

// Call the setup function to activate the interceptor
setupAxiosInterceptor();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
