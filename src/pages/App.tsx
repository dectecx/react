import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { authManager } from '../services/authManager';
import { useLoading } from '../hooks/useLoading';
import LoadingOverlay from '../components/LoadingOverlay';

function App() {
  const navigate = useNavigate();
  const userRole = authManager.getUserRole();
  const { isLoading, loadingMessage } = useLoading();

  const handleLogout = () => {
    authManager.logout(navigate);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <h1>Work Items Management</h1>
          {userRole && (
            <span className="user-role">
              {userRole === 'Admin' ? '管理員' : '使用者'}
            </span>
          )}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </div>
  );
}

export default App;
