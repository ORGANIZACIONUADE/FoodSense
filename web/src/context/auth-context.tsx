"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  subscribeToAuth,
  type Session,
} from "@/lib/auth";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  login(email: string, clave: string): Promise<{ ok: boolean; error?: string }>;
  register(email: string, nombre: string, clave: string): Promise<{ ok: boolean; error?: string }>;
  update(changes: { nombre?: string; clave?: string; claveActual?: string }): Promise<{ ok: boolean; error?: string }>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((s) => {
      setSession(s);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, clave: string) {
    const result = await loginUser(email, clave);
    if (!result.ok) return { ok: false, error: result.error };
    setSession(result.user);
    return { ok: true };
  }

  async function register(email: string, nombre: string, clave: string) {
    const result = await registerUser(email, nombre, clave);
    if (!result.ok) return { ok: false, error: result.error };
    setSession(result.user);
    return { ok: true };
  }

  async function update(changes: { nombre?: string; clave?: string; claveActual?: string }) {
    const result = await updateUser(changes);
    if (!result.ok) return { ok: false, error: result.error };
    if (result.nombre && session) {
      setSession({ ...session, nombre: result.nombre });
    }
    return { ok: true };
  }

  async function logout() {
    await logoutUser();
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, loading, login, register, update, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
