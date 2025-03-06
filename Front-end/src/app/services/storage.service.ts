import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly AUTH_KEY = 'auth';

  saveAuth(data: { token: string; role: string }): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(data));
  }

  getAuth(): { token: string; role: string } | null {
    const data = localStorage.getItem(this.AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearAuth(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }
} 