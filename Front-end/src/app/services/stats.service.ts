import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private API_URL = `${environment.apiUrl}/api/admin/stats`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<{
    activeFormateurs: number;
    activeApprenants: number;
    activeClasses: number;
  }> {
    return this.http.get<{
      activeFormateurs: number;
      activeApprenants: number;
      activeClasses: number;
    }>(this.API_URL);
  }
} 