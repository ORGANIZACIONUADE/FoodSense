"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Icon } from "@/components/icons/icon";

export default function LoginPage() {
  const { session, loading, login, loginGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!loading && session) router.replace("/despensa");
  }, [loading, session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, clave);
    if (!result.ok) {
      setError(result.error ?? "Error al ingresar.");
      setSubmitting(false);
      return;
    }
    router.replace("/despensa");
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    const result = await loginGoogle();
    if (!result.ok) {
      if (result.error) setError(result.error);
      setGoogleLoading(false);
      return;
    }
    router.replace("/despensa");
  }

  if (loading || session) return null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-bg px-5 py-12">
      <div className="w-full max-w-[390px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-wash text-green">
            <Icon name="pantry" size={26} color="#2F8F5C" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">FoodSense</p>
            <p className="mt-0.5 text-sm text-ink-soft">Ingresá a tu cuenta</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-sm"
        >
          <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-bg px-4">
            <Icon name="user" size={18} color="#9AA09C" />
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-mute"
            />
          </div>

          <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-bg px-4">
            <Icon name="lock" size={18} color="#9AA09C" />
            <input
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              className="flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-mute"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-wash px-3 py-2 text-sm text-red-deep">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || googleLoading}
            className="mt-1 h-[52px] w-full rounded-[16px] bg-green text-[15px] font-semibold text-white transition-opacity disabled:opacity-60"
          >
            Ingresar
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium tracking-wide text-ink-mute">O CONTINUÁ CON</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting || googleLoading}
          className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[16px] border border-border bg-surface text-[15px] font-semibold text-ink shadow-sm transition-opacity disabled:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {googleLoading ? "Ingresando…" : "Continuar con Google"}
        </button>

        <p className="mt-5 text-center text-sm text-ink-soft">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="font-semibold text-green">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
