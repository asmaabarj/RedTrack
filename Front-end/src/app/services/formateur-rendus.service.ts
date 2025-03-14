import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtapeAvecRendus } from '../models/rendu.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormateurRendusService {
  private API_URL = `${environment.apiUrl}/api/formateur/apprenants`;

  constructor(private http: HttpClient) {}

  getApprenantRendus(apprenantId: string): Observable<EtapeAvecRendus[]> {
    return this.http.get<EtapeAvecRendus[]>(`${this.API_URL}/${apprenantId}/rendus`);
  }

  createRenduResponse(renduId: string, response: { commentaire: string, type: string }) {
    return this.http.post<any>(
      `${this.API_URL}/rendus/${renduId}/responses`,
      response
    );
  }
} 