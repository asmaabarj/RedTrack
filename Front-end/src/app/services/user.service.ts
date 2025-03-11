import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { UserResponse } from '../models/user.model';
import { ClassDTO } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getApprenants(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/apprenants`).pipe(
      mergeMap(async response => {
        const apprenantWithClasses = await Promise.all(
          response.content.map(async apprenant => {
            const classes = await firstValueFrom(this.getUserClasses(apprenant.id));
            const activeClasses = classes.filter(classe => classe.active);
            return { ...apprenant, classes: activeClasses };
          })
        );
        return { ...response, content: apprenantWithClasses };
      }),
      catchError(error => {
        console.error('Error fetching apprenants:', error);
        return throwError(() => new Error('Erreur lors du chargement des apprenants'));
      })
    );
  }

  getUserClasses(userId: string): Observable<ClassDTO[]> {
    return this.http.get<ClassDTO[]>(`${this.API_URL}/users/${userId}/classes`).pipe(
      catchError(error => {
        console.error('Error fetching user classes:', error);
        return throwError(() => new Error('Erreur lors du chargement des classes'));
      })
    );
  }

  archiveUser(userId: string): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${userId}/archive`, {});
  }

  getFormateurs(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/formateurs`);
  }
} 