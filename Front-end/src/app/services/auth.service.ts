import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginRequest, AuthResponse, UserProfileResponse } from '../models/auth.model';
import { Store } from '@ngrx/store';
import { logout } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private store: Store) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): Observable<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return this.http.post<void>(`${this.API_URL}/auth/logout`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.API_URL}/auth/profile`);
  }

  validateToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<boolean>(`${this.API_URL}/auth/validate-token`, {}, { headers })
      .pipe(
        catchError(() => of(false))
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Code d'erreur: ${error.status}`;
    }
    
    return throwError(() => ({
      error: errorMessage,
      status: error.status
    }));
  }
} 