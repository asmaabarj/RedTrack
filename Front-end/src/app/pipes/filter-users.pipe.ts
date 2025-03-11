import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'filterUsers',
  standalone: true
})
export class FilterUsersPipe implements PipeTransform {
  transform(users: User[] | null, searchTerm: string, classId?: string): User[] {
    if (!users) return [];
    
    let filtered = users;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.nom.toLowerCase().includes(searchLower) ||
        user.prenom.toLowerCase().includes(searchLower)
      );
    }

    if (classId) {
      filtered = filtered.filter(user => 
        user.classes?.some(classe => classe.id === classId)
      );
    }

    return filtered;
  }
}