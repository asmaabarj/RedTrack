import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, AuthResponse, UserProfileResponse } from '../models/auth.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { logout } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private store: Store) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials);
  }

  logout(): Observable<void> {
    // Clear local storage first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Then make the logout request
    return this.http.post<void>(`${this.API_URL}/auth/logout`, {}).pipe(
      tap(() => {
        // Clear store state after successful logout
        this.store.dispatch(logout());
      }),
      catchError(error => {
        console.error('Logout error:', error);
        // Still clear local state even if server request fails
        this.store.dispatch(logout());
        return throwError(() => error);
      })
    );
  }

  getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.API_URL}/auth/profile`);
  }
} 