import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, OpenAPI, ApiError } from '../api/generated';
import type { LoginResponse } from '../types/auth';

type FormMode = 'login' | 'register';

const LoginPage = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      if (mode === 'login') {
        const response = (await AuthService.postApiAuthLogin({
          username,
          password,
        })) as LoginResponse;

        const { accessToken, refreshToken } = response;

        if (typeof accessToken === 'string' && accessToken) {
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken); // Store refresh token
          OpenAPI.TOKEN = `Bearer ${accessToken}`;
          navigate('/');
        } else {
          setError(
            'Login successful, but no authentication token was received.'
          );
        }
      } else {
        await AuthService.postApiAuthRegister({
          username,
          password,
        });
        setMessage('Registration successful! Please log in.');
        setMode('login');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.body?.message || `An error occurred: ${err.statusText}`);
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(err);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setMessage(null);
  };

  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={toggleMode}>
        {mode === 'login'
          ? 'Need an account? Register'
          : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default LoginPage;
