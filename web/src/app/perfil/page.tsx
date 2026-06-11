"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Icon } from "@/components/icons/icon";
import { useAuth } from "@/context/auth-context";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function PerfilPage() {
  const session = useRequireAuth();
  const { update, logout, changeEmail } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState(session?.nombre ?? "");
  const [claveActual, setClaveActual] = useState("");
  const [claveNueva, setClaveNueva] = useState("");
  const [claveConfirm, setClaveConfirm] = useState("");

  const [msgDatos, setMsgDatos] = useState<{ ok: boolean; text: string } | null>(null);
  const [msgClave, setMsgClave] = useState<{ ok: boolean; text: string } | null>(null);

  const [emailMode, setEmailMode] = useState(false);
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [claveEmail, setClaveEmail] = useState("");
  const [msgEmail, setMsgEmail] = useState<{ ok: boolean; text: string } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  if (!session) return null;

  async function handleEmail() {
    setMsgEmail(null);
    setEmailLoading(true);
    const result = await changeEmail(nuevoEmail, claveEmail);
    setEmailLoading(false);
    if (!result.ok) {
      setMsgEmail({ ok: false, text: result.error ?? "Error al cambiar el email." });
    } else {
      setMsgEmail({ ok: true, text: `Te enviamos un correo a ${nuevoEmail} para confirmar el cambio.` });
      setNuevoEmail("");
      setClaveEmail("");
    }
  }

  async function handleDatos(e: React.FormEvent) {
    e.preventDefault();
    setMsgDatos(null);
    const result = await update({ nombre });
    if (!result.ok) {
      setMsgDatos({ ok: false, text: result.error ?? "Error al guardar." });
    } else {
      setMsgDatos({ ok: true, text: "Datos actualizados." });
    }
  }

  async function handleClave(e: React.FormEvent) {
    e.preventDefault();
    setMsgClave(null);
    if (!claveNueva) return setMsgClave({ ok: false, text: "Ingresá la nueva contraseña." });
    if (claveNueva !== claveConfirm)
      return setMsgClave({ ok: false, text: "Las contraseñas no coinciden." });
    const result = await update({ claveActual, clave: claveNueva });
    if (!result.ok) {
      setMsgClave({ ok: false, text: result.error ?? "Error al cambiar contraseña." });
    } else {
      setMsgClave({ ok: true, text: "Contraseña actualizada." });
      setClaveActual("");
      setClaveNueva("");
      setClaveConfirm("");
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <AppShell active="profile">
      <div className="px-[18px] pt-[max(0.75rem,env(safe-area-inset-top))] pb-8 lg:px-0 lg:pt-0 lg:max-w-lg">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-[26px] font-bold leading-none tracking-tight lg:text-[32px]">
            Mi perfil
          </h1>
          <p className="mt-1 text-[12.5px] text-ink-soft lg:text-sm">
            Tus datos personales y configuración de cuenta
          </p>
        </div>

        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-soft text-2xl font-bold text-green-deep">
            {session.nombre[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{session.nombre}</p>
            <p className="text-sm text-ink-mute">{session.email}</p>
          </div>
        </div>

        {/* Datos personales */}
        <section className="mb-5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-ink-mute">
            Datos personales
          </h2>
          <form onSubmit={handleDatos} className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-ink-soft">
                Nombre
              </label>
              <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-bg px-4">
                <Icon name="user" size={18} color="#9AA09C" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setMsgDatos(null); }}
                  required
                  className="flex-1 bg-transparent text-[15px] font-semibold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-ink-soft">
                Email
              </label>
              <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-surface-alt px-4">
                <Icon name="user" size={18} color="#C5C9C4" />
                <span className="flex-1 text-[15px] font-semibold text-ink-mute">
                  {session.email}
                </span>
                {session.provider === "password" && (
                  <button
                    type="button"
                    onClick={() => { setEmailMode((v) => !v); setMsgEmail(null); }}
                    className="text-[12.5px] font-semibold text-green"
                  >
                    {emailMode ? "Cancelar" : "Cambiar"}
                  </button>
                )}
              </div>
            </div>

            {emailMode && session.provider === "password" && (
              <div className="flex flex-col gap-3 rounded-xl border border-border bg-bg p-4">
                <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-surface px-4">
                  <Icon name="user" size={18} color="#9AA09C" />
                  <input
                    type="email"
                    placeholder="Nuevo email"
                    value={nuevoEmail}
                    onChange={(e) => { setNuevoEmail(e.target.value); setMsgEmail(null); }}
                    className="flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-mute"
                  />
                </div>
                <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-surface px-4">
                  <Icon name="lock" size={18} color="#9AA09C" />
                  <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={claveEmail}
                    onChange={(e) => { setClaveEmail(e.target.value); setMsgEmail(null); }}
                    className="flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-mute"
                  />
                </div>

                {msgEmail && (
                  <p className={`rounded-lg px-3 py-2 text-sm ${msgEmail.ok ? "bg-green-wash text-green-deep" : "bg-red-wash text-red-deep"}`}>
                    {msgEmail.text}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleEmail}
                  disabled={emailLoading || !nuevoEmail || !claveEmail}
                  className="h-[44px] w-full rounded-[14px] bg-green text-[14px] font-semibold text-white transition-opacity disabled:opacity-60"
                >
                  {emailLoading ? "Enviando…" : "Enviar correo de verificación"}
                </button>
              </div>
            )}

            {msgDatos && (
              <p className={`rounded-lg px-3 py-2 text-sm ${msgDatos.ok ? "bg-green-wash text-green-deep" : "bg-red-wash text-red-deep"}`}>
                {msgDatos.text}
              </p>
            )}

            <button
              type="submit"
              className="h-[52px] w-full rounded-[16px] bg-green text-[15px] font-semibold text-white transition-opacity"
            >
              Guardar cambios
            </button>
          </form>
        </section>

        {/* Cambiar contraseña — solo para cuentas con email/contraseña */}
        {session.provider === "password" && (
          <section className="mb-5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-ink-mute">
              Cambiar contraseña
            </h2>
            <form onSubmit={handleClave} className="flex flex-col gap-3">
              <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-bg px-4">
                <Icon name="lock" size={18} color="#9AA09C" />
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  value={claveActual}
                  onChange={(e) => { setClaveActual(e.target.value); setMsgClave(null); }}
                  className="flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-mute"
                />
              </div>

              <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-bg px-4">
                <Icon name="lock" size={18} color="#9AA09C" />
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={claveNueva}
                  onChange={(e) => { setClaveNueva(e.target.value); setMsgClave(null); }}
                  className="flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-mute"
                />
              </div>

              <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-bg px-4">
                <Icon name="lock" size={18} color="#9AA09C" />
                <input
                  type="password"
                  placeholder="Confirmá la nueva contraseña"
                  value={claveConfirm}
                  onChange={(e) => { setClaveConfirm(e.target.value); setMsgClave(null); }}
                  className="flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-mute"
                />
              </div>

              {msgClave && (
                <p className={`rounded-lg px-3 py-2 text-sm ${msgClave.ok ? "bg-green-wash text-green-deep" : "bg-red-wash text-red-deep"}`}>
                  {msgClave.text}
                </p>
              )}

              <button
                type="submit"
                className="h-[52px] w-full rounded-[16px] bg-green text-[15px] font-semibold text-white transition-opacity"
              >
                Cambiar contraseña
              </button>
            </form>
          </section>
        )}

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[16px] border border-border bg-surface text-[15px] font-semibold text-red transition-colors hover:bg-red-wash"
        >
          <Icon name="x" size={18} color="#D85B4A" />
          Cerrar sesión
        </button>
      </div>
    </AppShell>
  );
}
