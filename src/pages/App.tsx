import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { OpenAPI } from '../api/generated';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from storage and API client
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    OpenAPI.TOKEN = undefined;

    // Navigate to login page
    navigate('/login');
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
