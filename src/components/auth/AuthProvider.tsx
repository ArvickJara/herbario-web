// src/components/auth/AuthProvider.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        // Revisa si el usuario ya está autenticado en la sesión del navegador
        return sessionStorage.getItem('isAuthenticated') === 'true';
    });
    const navigate = useNavigate();

    const login = async (password: string): Promise<boolean> => {
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        // NOTA: Esta es una validación solo en el frontend y NO es segura para producción.
        // En una aplicación real, esto debería ser una llamada a una API que valide en el backend.
        if (password === adminPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem('isAuthenticated', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    return context;
};