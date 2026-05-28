import Link from "next/link";
import { Icon } from "@/components/icons/icon";
import type { NavId } from "./side-nav";

const TABS: { id: NavId; label: string; icon: string; href: string | null }[] = [
  { id: "home",    label: "Inicio",   icon: "home", href: null },
  { id: "pantry",  label: "Despensa", icon: "list", href: "/despensa" },
  { id: "alerts",  label: "Alertas",  icon: "bell", href: null },
  { id: "profile", label: "Perfil",   icon: "user", href: null },
];

type TabBarProps = {
  active: NavId;
};

/** Navegación visual del wireframe; otras pantallas llegan en sprints siguientes. */
export function TabBar({ active }: TabBarProps) {
  return (
    <nav
      className="sticky bottom-0 z-10 border-t border-border bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm lg:hidden"
      aria-label="Navegación principal"
    >
      <ul className="flex justify-around">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const className = `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
            isActive ? "text-green" : "text-ink-mute"
          }`;
          const inner = (
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
