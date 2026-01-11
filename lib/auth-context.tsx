"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser } from "./api";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "shopkeeper" | "customer";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // To help with redirect on logout if needed

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem("urbanZ_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      localStorage.setItem("urbanZ_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password?: string) => {
    // Mock signup - in real app, call API
    const userData = { id: "new-" + Date.now(), name, email, role: "customer" as const };
    setUser(userData);
    localStorage.setItem("urbanZ_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("urbanZ_user");
    // Force clean state
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
