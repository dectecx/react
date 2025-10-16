import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { authManager } from '../services/authManager';
import { useGlobalLoading } from '../services/globalLoadingManager';
import { globalLoadingManager } from '../services/globalLoadingManager';
import LoadingOverlay from '../components/LoadingOverlay';

function App() {
  const navigate = useNavigate();
  const userRole = authManager.getUserRole();
  const { isLoading, loadingMessage } = useGlobalLoading();

  const handleLogout = () => {
    authManager.logout(navigate);
  };

  // 測試 Loading 遮罩的函數
  const testLoading = async () => {
    await globalLoadingManager.withLoading(async () => {
      // 模擬 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 2000));
    }, 'Testing Loading...');
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
        <div className="header-right">
          <button onClick={testLoading} className="test-loading-button">
            Test Loading
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </div>
  );
}

export default App;
