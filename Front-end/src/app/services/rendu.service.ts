import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtapeAvecRendus } from '../models/rendu.model';
import { environment } from '../../environments/environment';
import { RenduDTO } from '../models/rendu.model';

@Injectable({
  providedIn: 'root'
})
export class RenduService {
  private API_URL = `${environment.apiUrl}/api/apprenant/rendus`;

  constructor(private http: HttpClient) {}

  getEtapesAvecRendus(): Observable<EtapeAvecRendus[]> {
    return this.http.get<EtapeAvecRendus[]>(`${this.API_URL}/etapes`);
  }

  createRendu(rendu: RenduDTO): Observable<RenduDTO> {
    return this.http.post<RenduDTO>(this.API_URL, rendu);
  }
} 