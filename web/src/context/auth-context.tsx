"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getSession,
  loginUser,
  registerUser,
  saveSession,
  type Session,
} from "@/lib/auth";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  login(email: string, clave: string): { ok: boolean; error?: string };
  register(email: string, nombre: string, clave: string): { ok: boolean; error?: string };
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(getSession());
    setLoading(false);
  }, []);

  function login(email: string, clave: string) {
    const result = loginUser(email, clave);
    if (!result.ok) return { ok: false, error: result.error };
    const s: Session = { email: result.user.email, nombre: result.user.nombre };
    saveSession(s);
    setSession(s);
    return { ok: true };
  }

  function register(email: string, nombre: string, clave: string) {
    const result = registerUser(email, nombre, clave);
    if (!result.ok) return { ok: false, error: result.error };
    const s: Session = { email: result.user.email, nombre: result.user.nombre };
    saveSession(s);
    setSession(s);
    return { ok: true };
  }

  function logout() {
    saveSession(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
