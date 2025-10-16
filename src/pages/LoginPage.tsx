import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, TestDataService, OpenAPI, ApiError } from '../api/generated';
import './LoginPage.css';
import { authManager } from '../services/authManager';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { useI18n } from '../hooks/useI18n';

type FormMode = 'login' | 'register';

const LoginPage = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [testDataMessage, setTestDataMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, currentLanguage, changeLanguage } = useI18n();
  const { isExecuting, executeAsync } = useAsyncAction(mode === 'login' ? t('loggingIn') : t('registering'));
  const { isExecuting: isCreatingTestData, executeAsync: executeTestDataAsync } = useAsyncAction(t('creatingTestData'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!username || !password) {
      setError(t('usernameRequired'));
      return;
    }

    const result = await executeAsync(async () => {
      if (mode === 'login') {
        const response = await AuthService.postApiAuthLogin({
          username,
          password,
        });
        const { accessToken, refreshToken } = response;
        
        authManager.setTokens(accessToken, refreshToken);
        OpenAPI.TOKEN = accessToken;
        
        navigate('/');
      } else {
        await AuthService.postApiAuthRegister({
          username,
          password,
        });
        setMessage(t('registerSuccess'));
        setMode('login');
      }
    });

    if (result === null) return; // Prevented duplicate execution

    // Handle errors
    if (result && result instanceof Error) {
      if (result instanceof ApiError) {
        setError(result.body?.message || `An error occurred: ${result.statusText}`);
      } else {
        setError(mode === 'login' ? t('loginError') : t('registerError'));
      }
      console.error(result);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setMessage(null);
  };

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'zh-TW' ? 'en-US' : 'zh-TW');
  };

  const handleCreateTestData = async () => {
    setTestDataMessage(null);
    setError(null);

    const result = await executeTestDataAsync(async () => {
      await TestDataService.postApiTestDataCreateTestUsers();
    });

    if (result === null) return; // Prevented duplicate execution

    // Handle errors
    if (result && result instanceof Error) {
      if (result instanceof ApiError) {
        setError(result.body?.message || `An error occurred: ${result.statusText}`);
      } else {
        setError(t('testDataError'));
      }
      console.error(result);
    } else {
      setTestDataMessage(t('testDataCreated'));
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-language-toggle">
        <button 
          onClick={toggleLanguage} 
          className="language-toggle-button"
          title={currentLanguage === 'zh-TW' ? 'Switch to English' : '切換到中文'}
        >
          {currentLanguage === 'zh-TW' ? '🇺🇸' : '🇹🇼'}
        </button>
      </div>
      <div className="login-form-card">
        <h2>{mode === 'login' ? t('login') : t('register')}</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div className="form-group">
            <label htmlFor="username">{t('username')}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-button" disabled={isExecuting}>
            {isExecuting ? (mode === 'login' ? t('loggingIn') : t('registering')) : (mode === 'login' ? t('loginButton') : t('registerButton'))}
          </button>
        </form>
        <button onClick={toggleMode} className="toggle-mode-button">
          {mode === 'login'
            ? t('needAccount')
            : t('alreadyHaveAccount')}
        </button>
        
        {/* Test Data Section */}
        <div className="test-data-section">
          <h3>{t('testDataInfo')}</h3>
          <div className="test-data-info">
            <p className="test-data-admin">{t('testDataAdminInfo')}</p>
            <p className="test-data-user">{t('testDataUserInfo')}</p>
          </div>
          {testDataMessage && <p className="success-message">{testDataMessage}</p>}
          <button 
            onClick={handleCreateTestData} 
            className="test-data-button"
            disabled={isCreatingTestData}
          >
            {isCreatingTestData ? t('creatingTestData') : t('createTestData')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
