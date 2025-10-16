import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { authManager } from '../services/authManager';
import { useGlobalLoading } from '../services/globalLoadingManager';
import { globalLoadingManager } from '../services/globalLoadingManager';
import LoadingOverlay from '../components/LoadingOverlay';
import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';

function App() {
  const navigate = useNavigate();
  const userRole = authManager.getUserRole();
  const userName = authManager.getUserName();
  const { isLoading, loadingMessage } = useGlobalLoading();
  const [showTestButton, setShowTestButton] = useState(false);
  const { t, currentLanguage, changeLanguage } = useI18n();

  const handleLogout = () => {
    authManager.logout(navigate);
  };

  // 測試 Loading 遮罩的函數
  const testLoading = async () => {
    await globalLoadingManager.withLoading(async () => {
      // 模擬 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 2000));
    }, t('testLoading'));
  };

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'zh-TW' ? 'en-US' : 'zh-TW');
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <h1>{t('appTitle')}</h1>
          {userRole && (
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">
                {userRole === 'Admin' ? t('admin') : t('user')}
              </span>
            </div>
          )}
        </div>
        <div className="header-right">
          <button 
            onClick={() => setShowTestButton(!showTestButton)} 
            className="toggle-test-button"
            title={showTestButton ? t('hideTestButton') : t('showTestButton')}
          >
            {showTestButton ? '🔽' : '🔼'}
          </button>
          {showTestButton && (
            <button onClick={testLoading} className="test-loading-button">
              {t('testLoading')}
            </button>
          )}
          <button 
            onClick={toggleLanguage} 
            className="language-toggle-button"
            title={currentLanguage === 'zh-TW' ? 'Switch to English' : '切換到中文'}
          >
            {currentLanguage === 'zh-TW' ? '🇺🇸' : '🇹🇼'}
          </button>
          <button onClick={handleLogout} className="logout-button">
            {t('logout')}
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
