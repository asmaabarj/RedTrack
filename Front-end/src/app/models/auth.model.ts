export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    role: string;
}

export interface UserProfileResponse {
    email: string;
    nom: string;
    prenom: string;
    role: string;
}
