export interface JwtPayload {
    username: string;
    roles: string[];
    exp: number;
}

export interface AuthPayload {
    username: string
    password: string
}

export interface AuthResponse {
    token: string;
}