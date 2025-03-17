import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly AUTH_KEY = 'auth';
  private readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor() {}

  setAuth(token: string, role: string): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify({ token, role }));
  }

  getAuth(): { token: string; role: string } | null {
    const authData = localStorage.getItem(this.AUTH_KEY);
    if (!authData) return null;
    
    const auth = JSON.parse(authData);
    if (!this.isTokenValid(auth.token)) {
      this.clearAuth();
      return null;
    }
    
    return auth;
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  }

  clearAuth(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  isLoggedIn(): boolean {
    const auth = this.getAuth();
    return !!auth && !!auth.token;
  }
} 