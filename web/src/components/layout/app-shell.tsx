import type { ReactNode } from "react";
import { SideNav, type NavId } from "./side-nav";
import { TabBar } from "./tab-bar";

type AppShellProps = {
  children: ReactNode;
  active: NavId;
};

/**
 * Mobile: columna centrada (max 430px) + tab bar inferior.
 * Desktop (lg+): sidebar + área de contenido ancha.
 */
export function AppShell({ children, active }: AppShellProps) {
  return (
    <div className="flex min-h-full w-full flex-col bg-bg lg:min-h-screen lg:flex-row">
      <SideNav active={active} />

      <div className="flex min-h-full flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col lg:mx-auto lg:max-w-6xl lg:px-8 lg:py-8 xl:max-w-7xl">
          {children}
          <TabBar active={active} />
        </div>
      </div>
    </div>
  );
}
