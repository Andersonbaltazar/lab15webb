export interface Product {
    id: number;
    nombre: string;
    precio: string;
    description?: string;
    imageUrl?: string;
    CategoryId?: number;
    Category?: Category;
    createdAt? : string;
    updatedAt: string
}

export interface Category {
    id: number;
    nombre: string;
    descripcion?: string;
}

export interface User {
    id: number;
    email: string;
    nombre?: string;
    role: 'ADMIN' | 'CUSTOMER';
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface ApiResponse<T>{
    success: boolean;
    message: string;
    data: T;
}