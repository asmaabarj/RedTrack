import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, AuthResponse, UserProfileResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuth()?.token}`
      }
    });
  }

  getCurrentUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/profile`);
  }
} 