export interface Etape {
  id: string;
  titre: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  classesIds?: string[];
} 