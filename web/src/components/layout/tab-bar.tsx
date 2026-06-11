"use client";

import Link from "next/link";
import { Icon } from "@/components/icons/icon";
import { useAuth } from "@/context/auth-context";
import type { NavId } from "./side-nav";

const TABS: { id: NavId; label: string; icon: string; href: string | null }[] = [
  { id: "home",    label: "Inicio",   icon: "home", href: "/" },
  { id: "pantry",  label: "Despensa", icon: "list", href: "/despensa" },
  { id: "alerts",  label: "Alertas",  icon: "bell", href: "/alertas" },
  { id: "profile", label: "Perfil",   icon: "user", href: "/perfil" },
];

type TabBarProps = {
  active: NavId;
};

export function TabBar({ active }: TabBarProps) {
  const { session } = useAuth();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm lg:hidden"
      aria-label="Navegación principal"
    >
      <ul className="mx-auto flex max-w-[430px] justify-around">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const className = `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
            isActive ? "text-green" : "text-ink-mute"
          }`;

          const inner =
            tab.id === "profile" ? (
              <>
                <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-bold ${isActive ? "bg-green-soft text-green-deep" : "bg-surface-alt text-ink-soft"}`}>
                  {session?.nombre[0].toUpperCase() ?? "?"}
                </span>
                {tab.label}
              </>
            ) : (
              <>
                <Icon
                  name={tab.icon}
                  size={22}
                  color={isActive ? "#2F8F5C" : "#9AA09C"}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                {tab.label}
              </>
            );

          return (
            <li key={tab.id}>
              {tab.href ? (
                <Link
                  href={tab.href}
                  className={className}
                  aria-current={isActive ? "page" : undefined}
                >
                  {inner}
                </Link>
              ) : (
                <span
                  className={className}
                  aria-current={isActive ? "page" : undefined}
                >
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
