import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'filterUsers',
  standalone: true
})
export class FilterUsersPipe implements PipeTransform {
  transform(users: User[] | null, searchTerm: string): User[] {
    if (!users || !searchTerm) return users || [];
    
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => 
      user.nom.toLowerCase().includes(searchLower) ||
      user.prenom.toLowerCase().includes(searchLower)
    );
  }
}