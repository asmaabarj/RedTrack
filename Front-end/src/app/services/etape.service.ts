import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etape } from '../models/etape.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtapeService {
  private API_URL = `${environment.apiUrl}/api/formateur/etapes`;
  private API_URL_APP = `${environment.apiUrl}/api/apprenant/etapes`;

  constructor(private http: HttpClient) {}

  getAllEtapes(): Observable<Etape[]> {
    return this.http.get<Etape[]>(this.API_URL);
  }

  createEtape(etape: any): Observable<Etape> {
    return this.http.post<Etape>(this.API_URL, etape);
  }

  updateEtape(id: string, etape: any): Observable<Etape> {
    return this.http.put<Etape>(`${this.API_URL}/${id}`, etape);
  }

  getApprenantEtapes(): Observable<Etape[]> {
    return this.http.get<Etape[]>(this.API_URL_APP);
  }
} 