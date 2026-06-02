"use client";

/**
 * UrbanZ — Auth Context (Django JWT Integration)
 *
 * Manages user authentication state using JWT tokens.
 * - Tokens stored in localStorage (urbanz_access, urbanz_refresh).
 * - User profile fetched from /api/auth/profile/ on mount.
 * - JWT payload decoded to extract role immediately on login.
 * - Logout blacklists the refresh token on the server.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchProfile,
  setTokens,
  clearTokens,
  getRefreshToken,
} from "./api";

// ---------------------------------------------------------------------------
// Types — matches frontend role names used in existing pages
// ---------------------------------------------------------------------------
export type UserRole = "admin" | "vendor" | "customer";

// Map backend roles to frontend-compatible values
// The existing pages use "shopkeeper" for vendor — we keep it compatible
export type FrontendRole = "admin" | "shopkeeper" | "customer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: FrontendRole; // Frontend-facing role ("shopkeeper" for vendor)
  backendRole: UserRole; // Actual backend role
  phone?: string;
  avatar?: string | null;
  storeDetails?: { storeName?: string; [key: string]: any };
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Role mapping: backend → frontend
// ---------------------------------------------------------------------------
function mapRole(backendRole: string): FrontendRole {
  if (backendRole === "vendor") return "shopkeeper";
  if (backendRole === "admin") return "admin";
  return "customer";
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from stored profile on mount
  const loadUser = useCallback(async () => {
    const stored = localStorage.getItem("urbanz_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("urbanz_user");
      }
    }

    // Verify token is still valid by fetching fresh profile
    try {
      const profile = await fetchProfile();
      const mappedUser: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: mapRole(profile.role),
        backendRole: profile.role,
        phone: profile.phone,
        avatar: profile.avatar,
      };
      setUser(mappedUser);
      localStorage.setItem("urbanz_user", JSON.stringify(mappedUser));
    } catch {
      // Token invalid — clear state
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const access = localStorage.getItem("urbanz_access");
    if (access) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [loadUser]);

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------
  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    const { user: userData, tokens } = data;

    setTokens(tokens.access, tokens.refresh);

    const mappedUser: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: mapRole(userData.role),
      backendRole: userData.role,
    };

    setUser(mappedUser);
    localStorage.setItem("urbanz_user", JSON.stringify(mappedUser));
  };

  // ---------------------------------------------------------------------------
  // Signup (Register as Customer)
  // ---------------------------------------------------------------------------
  const signup = async (name: string, email: string, password: string) => {
    const data = await registerUser({
      name,
      email,
      password,
      confirm_password: password,
    });

    const { user: userData, tokens } = data;
    setTokens(tokens.access, tokens.refresh);

    const mappedUser: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: mapRole(userData.role),
      backendRole: userData.role,
    };

    setUser(mappedUser);
    localStorage.setItem("urbanz_user", JSON.stringify(mappedUser));
  };

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------
  const logout = async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await logoutUser(refresh);
      } catch {
        // Ignore server-side logout errors
      }
    }
    clearTokens();
    setUser(null);
    window.location.href = "/";
  };

  // ---------------------------------------------------------------------------
  // Refresh user profile
  // ---------------------------------------------------------------------------
  const refreshUser = async () => {
    try {
      const profile = await fetchProfile();
      const mappedUser: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: mapRole(profile.role),
        backendRole: profile.role,
        phone: profile.phone,
        avatar: profile.avatar,
      };
      setUser(mappedUser);
      localStorage.setItem("urbanz_user", JSON.stringify(mappedUser));
    } catch {
      // Silently fail
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser, isLoading }}>
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
