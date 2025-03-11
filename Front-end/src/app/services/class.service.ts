import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassResponse, Class, CreateClassRequest } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private readonly API_URL = 'http://localhost:8080/api/admin/classes';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<ClassResponse> {
    return this.http.get<ClassResponse>(this.API_URL);
  }

  createClass(request: CreateClassRequest): Observable<Class> {
    return this.http.post<Class>(this.API_URL, request);
  }
} 