import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, OpenAPI, ApiError } from '../api/generated';
import './LoginPage.css';
import { authManager } from '../services/authManager';
import { globalLoadingManager } from '../services/globalLoadingManager';
import { useAsyncAction } from '../hooks/useAsyncAction';

type FormMode = 'login' | 'register';

const LoginPage = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isExecuting, executeAsync } = useAsyncAction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    const result = await executeAsync(async () => {
      if (mode === 'login') {
        await globalLoadingManager.withLoading(async () => {
          const response = await AuthService.postApiAuthLogin({
            username,
            password,
          });
          const { accessToken, refreshToken } = response;
          
          authManager.setTokens(accessToken, refreshToken);
          OpenAPI.TOKEN = accessToken;
          
          navigate('/');
        }, 'Logging in...');
      } else {
        await globalLoadingManager.withLoading(async () => {
          await AuthService.postApiAuthRegister({
            username,
            password,
          });
        }, 'Registering...');
        setMessage('Registration successful! Please log in.');
        setMode('login');
      }
    });

    if (result === null) return; // Prevented duplicate execution

    // Handle errors
    if (result && result instanceof Error) {
      if (result instanceof ApiError) {
        setError(result.body?.message || `An error occurred: ${result.statusText}`);
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(result);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setMessage(null);
  };

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-button" disabled={isExecuting}>
            {isExecuting ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        <button onClick={toggleMode} className="toggle-mode-button">
          {mode === 'login'
            ? 'Need an account? Register'
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
