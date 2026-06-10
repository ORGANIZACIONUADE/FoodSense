"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons/icon";
import { useAuth } from "@/context/auth-context";

const NAV_ITEMS = [
  { id: "home",    label: "Inicio",   icon: "home",  href: null },
  { id: "pantry",  label: "Despensa", icon: "list",  href: "/despensa" },
  { id: "alerts",  label: "Alertas",  icon: "bell",  href: null },
] as const;

export type NavId = "home" | "pantry" | "alerts" | "profile";

type SideNavProps = {
  active: NavId;
};

export function SideNav({ active }: SideNavProps) {
  const { session, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside
      className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-surface lg:flex"
      aria-label="Navegación principal"
    >
      <div className="border-b border-border-soft px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-wash text-green">
            <Icon name="pantry" size={20} color="#2F8F5C" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight">FoodSense</p>
            <p className="text-[11px] text-ink-mute">Tu despensa inteligente</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;
          const className = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive ? "bg-green-wash text-green-deep" : "text-ink-soft"
          }`;
          const inner = (
            <>
              <Icon
                name={item.icon}
                size={20}
                color={isActive ? "#1F6B43" : "#5C6460"}
                strokeWidth={isActive ? 2 : 1.75}
              />
              {item.label}
            </>
          );
          return item.href ? (
            <Link
              key={item.id}
              href={item.href}
              className={className}
              aria-current={isActive ? "page" : undefined}
            >
              {inner}
            </Link>
          ) : (
            <span
              key={item.id}
              className={className}
              aria-current={isActive ? "page" : undefined}
            >
              {inner}
            </span>
          );
        })}
      </nav>

      {session && (
        <div className="border-t border-border-soft px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-soft text-sm font-bold text-green-deep">
              {session.nombre[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">
                {session.nombre}
              </p>
              <p className="truncate text-[11px] text-ink-mute">{session.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-lg p-1.5 text-ink-mute transition-colors hover:bg-surface-alt hover:text-ink"
              title="Cerrar sesión"
            >
              <Icon name="x" size={16} color="currentColor" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
