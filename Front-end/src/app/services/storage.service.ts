import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly AUTH_KEY = 'auth';

  constructor() {}

  setAuth(token: string, role: string): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify({ token, role }));
  }

  getAuth(): { token: string; role: string } | null {
    const auth = localStorage.getItem(this.AUTH_KEY);
    if (!auth) return null;
    try {
      return JSON.parse(auth);
    } catch {
      this.clearAuth();
      return null;
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