export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'FORMATEUR' | 'APPRENANT';
  active: boolean;
  classesIds: string[];
}

export interface UserResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// export enum Role {
//     ADMIN = 'ADMIN',
//     FORMATEUR = 'FORMATEUR',
//     APPRENANT = 'APPRENANT'
// }
