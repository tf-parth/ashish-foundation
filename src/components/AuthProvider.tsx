"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type AuthSession,
  getCurrentUser,
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
  seedAdmin,
} from "@/lib/auth";

interface AuthContextType {
  user: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: { name: string; email: string; password: string }) => {
    success: boolean;
    error?: string;
  };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedAdmin();
    const session = getCurrentUser();
    setUser(session);
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const signup = useCallback(
    (data: { name: string; email: string; password: string }) => {
      const result = authSignup(data);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    },
    []
  );

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
