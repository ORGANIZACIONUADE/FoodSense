import { Icon } from "@/components/icons/icon";

const NAV_ITEMS = [
  { id: "home", label: "Inicio", icon: "home" },
  { id: "pantry", label: "Despensa", icon: "list" },
  { id: "alerts", label: "Alertas", icon: "bell" },
  { id: "profile", label: "Perfil", icon: "user" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];

type SideNavProps = {
  active: NavId;
};

export function SideNav({ active }: SideNavProps) {
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
          return (
            <span
              key={item.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-wash text-green-deep"
                  : "text-ink-soft"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                name={item.icon}
                size={20}
                color={isActive ? "#1F6B43" : "#5C6460"}
                strokeWidth={isActive ? 2 : 1.75}
              />
              {item.label}
            </span>
          );
        })}
      </nav>

      <p className="px-6 py-4 text-[11px] leading-relaxed text-ink-mute">
        Sprint 1 · Panel de inventario
      </p>
    </aside>
  );
}
