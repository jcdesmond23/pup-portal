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
    loginModalOpen: boolean;
    openLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    username: null,
    login: async () => {},
    logout: () => {},
    loginModalOpen: false,
    openLoginModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<AuthState | null>(() => {
        const savedAuth = localStorage.getItem('auth');
        return savedAuth ? JSON.parse(savedAuth) : null;
    });
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const login = useCallback(async (username: string, password: string) => {
        const { access_token } = await apiLogin(username, password);
        
        const newAuthState: AuthState = {
            token: access_token,
            username
        };
        
        setAuthState(newAuthState);
        localStorage.setItem('auth', JSON.stringify(newAuthState));
        setLoginModalOpen(false);
    }, []);

    const logout = useCallback(() => {
        setAuthState(null);
        localStorage.removeItem('auth');
    }, []);

    const openLoginModal = useCallback(() => {
        setLoginModalOpen(true);
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!authState,
            username: authState?.username || null,
            login,
            logout,
            loginModalOpen,
            openLoginModal,
        }}>
            {children}
        </AuthContext.Provider>
    );
}