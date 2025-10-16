import { OpenAPI } from "../api/generated";

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

class AuthManager {
  private static instance: AuthManager;
  private token: string | null = localStorage.getItem(TOKEN_KEY);
  private refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);

  private constructor() {}

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  public getTokens(): { token: string | null; refreshToken: string | null } {
    return {
      token: this.token,
      refreshToken: this.refreshToken,
    };
  }

  public setTokens(token: string, refreshToken: string): void {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  public clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    OpenAPI.TOKEN = undefined; // Also clear from the API client
  }

  public logout(navigate: (path: string) => void): void {
    this.clearTokens();
    navigate('/login');
  }
}

export const authManager = AuthManager.getInstance();
