"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Icon } from "@/components/icons/icon";
import { useAuth } from "@/context/auth-context";
import { useNotificationSettings } from "@/lib/use-notification-settings";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function PerfilPage() {
  const session = useRequireAuth();
  const { update, logout, resendVerification, refreshSession } = useAuth();
  const { settings, loading: loadingNotifications, saving: savingNotifications, enable, disable } =
    useNotificationSettings(session);
  const router = useRouter();

  const [nombre, setNombre] = useState(session?.nombre ?? "");
  const [claveActual, setClaveActual] = useState("");
  const [claveNueva, setClaveNueva] = useState("");
  const [claveConfirm, setClaveConfirm] = useState("");

  const [msgDatos, setMsgDatos] = useState<{ ok: boolean; text: string } | null>(null);
  const [msgClave, setMsgClave] = useState<{ ok: boolean; text: string } | null>(null);
  const [msgEmail, setMsgEmail] = useState<{ ok: boolean; text: string } | null>(null);
  const [emailActionLoading, setEmailActionLoading] = useState(false);

  if (!session) return null;

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

  async function handleResendVerification() {
    setMsgEmail(null);
    setEmailActionLoading(true);
    const result = await resendVerification();
    setEmailActionLoading(false);
    setMsgEmail(
      result.ok
        ? { ok: true, text: "Te enviamos un correo de confirmación." }
        : { ok: false, text: result.error ?? "No se pudo enviar el correo." },
    );
  }

  async function handleRefreshVerification() {
    setMsgEmail(null);
    setEmailActionLoading(true);
    const result = await refreshSession();
    setEmailActionLoading(false);
    setMsgEmail(
      result.ok
        ? { ok: true, text: "Estado de la cuenta actualizado." }
        : { ok: false, text: result.error ?? "No se pudo actualizar el estado." },
    );
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const notificationCopy = {
    unsupported: settings.error ?? "Este navegador no soporta notificaciones web.",
    "missing-config": "Falta configurar NEXT_PUBLIC_FIREBASE_VAPID_KEY.",
    default: "Activá avisos de vencimiento para esta cuenta y dispositivo.",
    granted: "El permiso está concedido, pero los avisos están pausados.",
    denied: "El navegador bloqueó las notificaciones. Podés habilitarlas desde la configuración del sitio.",
    enabled: "Vas a recibir avisos cuando haya productos por vencer.",
    error: settings.error ?? "No se pudieron configurar las notificaciones.",
  }[settings.status];

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

        {session.provider === "password" && (
          <section className={`mb-5 rounded-2xl border p-5 shadow-sm ${session.emailVerified ? "border-green-soft bg-green-wash" : "border-amber-soft bg-amber-wash"}`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${session.emailVerified ? "bg-green-soft" : "bg-amber-soft"}`}>
                <Icon
                  name={session.emailVerified ? "check" : "bell"}
                  size={19}
                  color={session.emailVerified ? "#1F6B43" : "#B8772D"}
                  strokeWidth={2.2}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-mute">
                  Confirmación de email
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {session.emailVerified
                    ? "Tu correo ya está confirmado."
                    : "Confirmá tu correo para reforzar la seguridad de la cuenta."}
                </p>

                {!session.emailVerified && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={emailActionLoading}
                      className="h-11 rounded-[14px] bg-green px-4 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                    >
                      {emailActionLoading ? "Enviando..." : "Reenviar correo"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRefreshVerification}
                      disabled={emailActionLoading}
                      className="h-11 rounded-[14px] border border-border bg-surface px-4 text-sm font-semibold text-ink-soft transition-opacity disabled:opacity-60"
                    >
                      Ya confirmé
                    </button>
                  </div>
                )}

                {msgEmail && (
                  <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${msgEmail.ok ? "bg-green-soft text-green-deep" : "bg-red-wash text-red-deep"}`}>
                    {msgEmail.text}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

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
              </div>
              <p className="mt-1 text-[11px] text-ink-faint">El email no se puede cambiar.</p>
            </div>

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
                  minLength={8}
                  className="flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-ink-mute"
                />
              </div>
              <p className="px-1 text-[11px] text-ink-mute">
                Usá al menos 8 caracteres, una mayúscula, una minúscula y un número.
              </p>

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

        <section className="mb-5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-mute">
                Notificaciones
              </h2>
              <p className="mt-1 text-sm text-ink-soft">{notificationCopy}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${settings.enabled ? "bg-green-soft" : "bg-surface-alt"}`}>
              <Icon
                name="bell"
                size={19}
                color={settings.enabled ? "#1F6B43" : "#9AA09C"}
              />
            </div>
          </div>

          {settings.status === "denied" || settings.status === "unsupported" || settings.status === "missing-config" ? (
            <div className="rounded-xl border border-border-soft bg-surface-alt px-4 py-3 text-sm font-medium text-ink-soft">
              {notificationCopy}
            </div>
          ) : settings.enabled ? (
            <button
              type="button"
              onClick={disable}
              disabled={savingNotifications || loadingNotifications}
              className="h-[52px] w-full rounded-[16px] border border-border bg-bg text-[15px] font-semibold text-ink-soft transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingNotifications ? "Guardando..." : "Pausar notificaciones"}
            </button>
          ) : (
            <button
              type="button"
              onClick={enable}
              disabled={savingNotifications || loadingNotifications}
              className="h-[52px] w-full rounded-[16px] bg-green text-[15px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingNotifications || loadingNotifications ? "Configurando..." : "Activar notificaciones"}
            </button>
          )}
        </section>

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
