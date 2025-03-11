import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClassResponse, Class, CreateClassRequest } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private readonly API_URL = 'http://localhost:8080/api/admin/classes';

  constructor(private http: HttpClient) {}

  // Active Classes Methods
  getClasses(): Observable<ClassResponse> {
    return this.http.get<ClassResponse>(this.API_URL).pipe(
      catchError(error => {
        console.error('Error fetching classes:', error);
        return throwError(() => new Error('Erreur lors du chargement des classes'));
      })
    );
  }

  getClassById(id: string): Observable<Class> {
    return this.http.get<Class>(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching class ${id}:`, error);
        return throwError(() => new Error('Erreur lors du chargement de la classe'));
      })
    );
  }

  // Archive Management Methods
  getArchivedClasses(): Observable<ClassResponse> {
    return this.http.get<ClassResponse>(`${this.API_URL}/archived`).pipe(
      catchError(error => {
        console.error('Error fetching archived classes:', error);
        return throwError(() => new Error('Erreur lors du chargement des classes archivées'));
      })
    );
  }

  archiveClass(id: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/archive`, {}).pipe(
      catchError(error => {
        console.error(`Error archiving class ${id}:`, error);
        return throwError(() => new Error('Erreur lors de l\'archivage de la classe'));
      })
    );
  }

  unarchiveClass(id: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/unarchive`, {}).pipe(
      catchError(error => {
        console.error(`Error unarchiving class ${id}:`, error);
        return throwError(() => new Error('Erreur lors de la désarchivage de la classe'));
      })
    );
  }

  // CRUD Operations
  createClass(request: CreateClassRequest): Observable<Class> {
    return this.http.post<Class>(this.API_URL, request).pipe(
      catchError(error => {
        console.error('Error creating class:', error);
        if (error.status === 409) {
          return throwError(() => new Error('Une classe avec ce nom existe déjà'));
        }
        return throwError(() => new Error('Erreur lors de la création de la classe'));
      })
    );
  }

  updateClass(id: string, request: CreateClassRequest): Observable<Class> {
    return this.http.put<Class>(`${this.API_URL}/${id}`, request).pipe(
      catchError(error => {
        console.error(`Error updating class ${id}:`, error);
        if (error.status === 409) {
          return throwError(() => new Error('Une classe avec ce nom existe déjà'));
        }
        return throwError(() => new Error('Erreur lors de la mise à jour de la classe'));
      })
    );
  }

  getClassDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}/details`).pipe(
      catchError(error => {
        console.error(`Error fetching class details ${id}:`, error);
        return throwError(() => new Error('Erreur lors du chargement des détails de la classe'));
      })
    );
  }
} 