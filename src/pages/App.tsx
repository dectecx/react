import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { OpenAPI } from '../api/generated';
import { authManager } from '../services/authManager';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // The authManager handles token clearing and OpenAPI.TOKEN reset internally is a good practice,
    // but the logout function in authManager is designed to take navigate.
    // So we'll call it here. The OpenAPI.TOKEN clearing will happen via the interceptor or can be added to authManager.
    authManager.logout(navigate);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>My TodoList</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
