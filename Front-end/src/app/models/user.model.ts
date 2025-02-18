export interface User {
    id: string;
    email: string;
    password: string;
    nom: string;
    prenom: string;
    role: Role;
    active: boolean;
}

export enum Role {
    ADMIN = 'ADMIN',
    FORMATTEUR = 'FORMATTEUR',
    APPRENANT = 'APPRENANT'
}
