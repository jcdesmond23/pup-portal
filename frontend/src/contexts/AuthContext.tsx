import { createContext, useContext, useState } from "react";
import LoginModal from "../components/LoginModal/LoginModal";

interface AuthContextType {
    login: (username: string, password: string) =>void;
    loginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
  }
  
  const AuthContext = createContext<AuthContextType>({
    login: async () => {},
    loginModalOpen: false,
    openLoginModal: () => {},
    closeLoginModal: () => {}
  });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loginModalOpen, setLoginModalOpen] = useState(true);

    const login = (username: string, password: string) => {
        console.log(`Logging in with username: ${username} and password: ${password}`);
        setLoginModalOpen(false);
    }

    const openLoginModal = () => {
        setLoginModalOpen(true);
    }

    const closeLoginModal = () => {
        setLoginModalOpen(false);
    }
    return (
        <AuthContext.Provider value={{ 
            login,
            loginModalOpen, 
            openLoginModal, 
            closeLoginModal 
         }}>
            {children}
            {loginModalOpen && <LoginModal />}
        </AuthContext.Provider>
    );
}