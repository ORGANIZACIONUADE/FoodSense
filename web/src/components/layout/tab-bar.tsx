import { Icon } from "@/components/icons/icon";
import type { NavId } from "./side-nav";

const TABS: { id: NavId; label: string; icon: string }[] = [
  { id: "home", label: "Inicio", icon: "home" },
  { id: "pantry", label: "Despensa", icon: "list" },
  { id: "alerts", label: "Alertas", icon: "bell" },
  { id: "profile", label: "Perfil", icon: "user" },
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
          return (
            <li key={tab.id}>
              <span
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${
                  isActive ? "text-green" : "text-ink-mute"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  color={isActive ? "#2F8F5C" : "#9AA09C"}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                {tab.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
