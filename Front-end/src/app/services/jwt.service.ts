import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  extractRole(token: string): Role {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.role as Role;
  }
} 