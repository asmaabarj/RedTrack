import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, firstValueFrom, of } from 'rxjs';
import { catchError, mergeMap, tap, map } from 'rxjs/operators';
import { UserResponse, User, UpdateUserRequest } from '../models/user.model';
import { ClassDTO } from '../models/class.model';
import { RegisterRequest } from '../models/user.model';

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
    return this.http.put(`${this.API_URL}/users/${userId}/archive`, {}).pipe(
      catchError(error => {
        console.error('Error archiving user:', error);
        return throwError(() => new Error('Erreur lors de l\'archivage de l\'utilisateur'));
      })
    );
  }

  getFormateurs(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/formateurs`).pipe(
      mergeMap(async response => {
        const formateurWithClasses = await Promise.all(
          response.content.map(async formateur => {
            const classes = await firstValueFrom(this.getUserClasses(formateur.id));
            const activeClasses = classes.filter(classe => classe.active);
            return { ...formateur, classes: activeClasses };
          })
        );
        return { ...response, content: formateurWithClasses };
      })
    );
  }

  register(request: RegisterRequest): Observable<any> {
    console.log('Sending register request:', request);
    return this.http.post(`${this.API_URL}/register`, request).pipe(
      tap(response => console.log('Register response:', response)),
      catchError(error => {
        console.error('Error registering user:', error);
        return throwError(() => new Error(error.error?.message || 'Erreur lors de la création de l\'utilisateur'));
      })
    );
  }

  updateUser(userId: string, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${userId}`, request);
  }

  updateUserClass(userId: string, classId: string): Observable<void> {
    return this.http.get<any>(`${this.API_URL}/users/${userId}/classes`).pipe(
      mergeMap(classes => {
        if (classes && classes.length > 0) {
          return this.http.put<void>(`${this.API_URL}/users/${userId}/classes/${classes[0].id}/${classId}`, {});
        }
        return this.http.post<void>(`${this.API_URL}/users/${userId}/classes/${classId}`, {});
      })
    );
  }

  getArchivedApprenants(): Observable<User[]> {
    return this.http.get<any>(`${this.API_URL}/apprenants/archives`).pipe(
      map(response => response.content)
    );
  }

  unarchiveUser(userId: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/users/${userId}/unarchive`, {});
  }

  getArchivedFormateurs(): Observable<User[]> {
    return this.http.get<any>(`${this.API_URL}/formateurs/archives`).pipe(
      map(response => response.content)
    );
  }
} 