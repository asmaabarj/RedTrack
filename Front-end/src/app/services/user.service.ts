import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getFormateurs(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/formateurs`).pipe(
      catchError(error => {
        console.error('Error fetching formateurs:', error);
        return throwError(() => new Error('Erreur lors du chargement des formateurs'));
      })
    );
  }

  getApprenants(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/apprenants`).pipe(
      catchError(error => {
        console.error('Error fetching apprenants:', error);
        return throwError(() => new Error('Erreur lors du chargement des apprenants'));
      })
    );
  }

  archiveUser(userId: string): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${userId}/archive`, {}).pipe(
      catchError(error => {
        console.error('Error archiving user:', error);
        return throwError(() => new Error('Erreur lors de l\'archivage de l\'utilisateur'));
      })
    );
  }
} 