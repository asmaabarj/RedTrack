export type RenduType = 'rejected' | 'accepted' | 'pending';

export interface Rendu {
  id: string;
  livrable: string;
  dateSoumission: Date;
  commentaire: string;
  type: RenduType;
  etapeId: string;
  apprenantId: string;
  apprenantNom: string;
  apprenantPrenom: string;
}

export interface RenduResponse {
  id: string;
  commentaire: string;
  dateSoumission: Date;
  formateurId: string;
  formateurNom: string;
  formateurPrenom: string;
  renduId: string;
}

export interface EtapeAvecRendus {
  id: string;
  titre: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  rendus: RenduAvecResponses[];
}

export interface RenduAvecResponses extends Rendu {
  responses: RenduResponse[];
}

export interface RenduDTO {
  id?: string;
  livrable: string;
  commentaire: string;
  etapeId: string;
  type?: string;
  dateSoumission?: Date;
} 
 
export interface RenduAvecResponses extends Rendu {
  responses: RenduResponse[];
} 