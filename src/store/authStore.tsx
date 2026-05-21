"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService } from "@/services/authService";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const storedUser = authService.getStoredUser();
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => setUser(userData);

  const updateUser = (userData: User) => {
    localStorage.setItem("admin_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
