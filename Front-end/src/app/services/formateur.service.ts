import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse , CreateApprenantRequest, User, UpdateApprenantRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private readonly API_URL = 'http://localhost:8080/api/formateur';

  constructor(private http: HttpClient) {}

  getApprenants(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/apprenants`);
  }
  getArchivedApprenants(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/apprenants/archives`);
  }
  
  archiveApprenant(apprenantId: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/apprenants/${apprenantId}/archive`, {});
  }

  unarchiveApprenant(apprenantId: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/apprenants/${apprenantId}/unarchive`, {});
  }
  createApprenant(request: CreateApprenantRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/apprenants`, request);
  }
  
  updateApprenant(apprenantId: string, request: UpdateApprenantRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/apprenants/${apprenantId}`, request);
  }
}
