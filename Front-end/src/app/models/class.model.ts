export interface Class {
  id: string;
  nom: string;
  niveau: string;
  annee: string;
  active: boolean;
}

export interface ClassResponse {
  content: Class[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateClassRequest {
  nom: string;
  niveau: string;
  annee: string;
}

export interface ClassDTO {
  id: string;
  nom: string;
  niveau: string;
  annee: string;
  active: boolean;
}