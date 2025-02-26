import { createContext, useContext, useState, useCallback } from "react";

interface User {
    username: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: () => {},
    loginModalOpen: false,
    openLoginModal: () => {},
    closeLoginModal: () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const login = useCallback(async (username: string, password: string) => {
        setUser({ username, password });
        localStorage.setItem('user', JSON.stringify({ username, password }));
        setLoginModalOpen(false);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    const openLoginModal = useCallback(() => {
        setLoginModalOpen(true);
    }, []);

    const closeLoginModal = useCallback(() => {
        setLoginModalOpen(false);
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user,
            login,
            logout,
            loginModalOpen, 
            openLoginModal, 
            closeLoginModal 
         }}>
            {children}
        </AuthContext.Provider>
    );
}