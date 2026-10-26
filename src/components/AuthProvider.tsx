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
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

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
  const [user, setUser] = useState<AuthSession | null>(() => {
    if (typeof window !== "undefined") {
      seedAdmin();
      return getCurrentUser();
    }
    return null;
  });
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          userId: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name || data.user.email || "Admin",
          role: (data.user.app_metadata?.role as "admin" | "user") || "admin",
        });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sbSession) => {
        if (sbSession?.user) {
          setUser({
            userId: sbSession.user.id,
            email: sbSession.user.email || "",
            name: sbSession.user.user_metadata?.name || sbSession.user.email || "Admin",
            role: (sbSession.user.app_metadata?.role as "admin" | "user") || "admin",
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (isSupabaseConfigured()) {
      supabase.auth.signInWithPassword({ email, password }).then(({ data, error }) => {
        if (!error && data.user) {
          setUser({
            userId: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email,
            role: (data.user.app_metadata?.role as "admin" | "user") || "admin",
          });
        }
      }).catch(() => {});
    }

    const result = authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const signup = useCallback(
    (data: { name: string; email: string; password: string }) => {
      if (isSupabaseConfigured()) {
        supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { name: data.name },
          },
        }).catch(() => {});
      }

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
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch(() => {});
    }
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
