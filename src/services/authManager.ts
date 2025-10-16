import { OpenAPI } from "../api/generated";
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export type UserRole = 'Admin' | 'User';

interface JwtPayload {
  role?: UserRole;
  [key: string]: any;
}

class AuthManager {
  private static instance: AuthManager;
  private token: string | null = localStorage.getItem(TOKEN_KEY);
  private refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);
  private userRole: UserRole | null = null;

  private constructor() {
    // Decode role from token on initialization
    if (this.token) {
      try {
        const decoded = jwtDecode<JwtPayload>(this.token);
        this.userRole = decoded.role || 'User';
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.userRole = 'User'; // Default to User role
      }
    }
  }

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

  public getUserRole(): UserRole | null {
    return this.userRole;
  }

  public isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  public setTokens(token: string, refreshToken: string): void {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Decode and store user role
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.userRole = decoded.role || 'User';
    } catch (error) {
      console.error('Failed to decode token:', error);
      this.userRole = 'User';
    }
  }

  public clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    this.userRole = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    OpenAPI.TOKEN = undefined;
  }

  public logout(navigate: (path: string) => void): void {
    this.clearTokens();
    navigate('/login');
  }
}

export const authManager = AuthManager.getInstance();
