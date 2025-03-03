import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  extractRole(token: string): Role {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
      
      // Vérifiez la structure exacte de votre token
      const role = decodedToken.role || decodedToken.authorities?.[0] || decodedToken.roles?.[0];
      console.log('Extracted role from token:', role);
      
      if (!role) {
        console.error('No role found in token');
        return Role.APPRENANT; // Valeur par défaut
      }

      return role as Role;
    } catch (error) {
      console.error('Error decoding token:', error);
      return Role.APPRENANT;
    }
  }
} 