"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Icon } from "@/components/icons/icon";

export default function LoginPage() {
  const { session, loading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
            disabled={submitting}
            className="mt-1 h-[52px] w-full rounded-[16px] bg-green text-[15px] font-semibold text-white transition-opacity disabled:opacity-60"
          >
            Ingresar
          </button>
        </form>

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
