import { createContext, useContext, useState, useCallback } from "react";
import { login as apiLogin } from "../api/auth";

interface AuthState {
    token: string;
    username: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    username: null,
    login: async () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState | null>(() => {
        const savedAuth = localStorage.getItem('auth');
        return savedAuth ? JSON.parse(savedAuth) : null;
    });

    const login = useCallback(async (username: string, password: string) => {
        const { access_token } = await apiLogin(username, password);
        
        const newAuthState: AuthState = {
            token: access_token,
            username
        };
        
        setAuthState(newAuthState);
        localStorage.setItem('auth', JSON.stringify(newAuthState));
    }, []);
    
    const logout = useCallback(() => {
        setAuthState(null);
        localStorage.removeItem('auth');
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!authState,
            username: authState?.username || null,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}