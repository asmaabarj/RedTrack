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

  constructor(private http: HttpClient) {}

  getAllEtapes(): Observable<Etape[]> {
    return this.http.get<Etape[]>(this.API_URL);
  }
} 