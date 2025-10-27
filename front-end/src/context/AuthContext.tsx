"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = document.cookie.split("; ").find(c => c.startsWith("token="))?.split("=")[1];
    if (token) {
      axios
        .get("https://pizza-hub-lime.vercel.app/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    document.cookie = `token=${userData.token}; path=/; max-age=${60 * 60 * 24}`;
  };

  const logout = () => {
    setUser(null);
    document.cookie = "token=; path=/; max-age=0";
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}
