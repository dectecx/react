import { OpenAPI } from "../api/generated";
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export type UserRole = 'Admin' | 'User';

interface JwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'?: string | string[];
  role?: UserRole | UserRole[];
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
        this.userRole = this.extractRole(decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.userRole = 'User'; // Default to User role
      }
    }
  }

  private extractRole(decoded: JwtPayload): UserRole {
    // Try to get role from Microsoft Claims Role first (the actual one used by backend)
    const microsoftRoleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (microsoftRoleClaim) {
      const roles = Array.isArray(microsoftRoleClaim) ? microsoftRoleClaim : [microsoftRoleClaim];
      if (roles.includes('Admin')) {
        return 'Admin';
      }
      if (roles.includes('User')) {
        return 'User';
      }
    }
    
    // Fallback to XMLSOAP Claims Role
    const xmlsoapRoleClaim = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
    if (xmlsoapRoleClaim) {
      const roles = Array.isArray(xmlsoapRoleClaim) ? xmlsoapRoleClaim : [xmlsoapRoleClaim];
      if (roles.includes('Admin')) {
        return 'Admin';
      }
      if (roles.includes('User')) {
        return 'User';
      }
    }
    
    // Fallback to simple 'role' claim
    const simpleRole = decoded.role;
    if (simpleRole) {
      const roles = Array.isArray(simpleRole) ? simpleRole : [simpleRole];
      if (roles.includes('Admin')) {
        return 'Admin';
      }
      if (roles.includes('User')) {
        return 'User';
      }
    }
    
    // Default to User role
    return 'User';
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
      this.userRole = this.extractRole(decoded);
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
