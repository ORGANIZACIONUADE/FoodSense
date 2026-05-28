import type { ReactNode } from "react";
import { AppShell } from "./app-shell";
import type { NavId } from "./side-nav";

type MobileShellProps = {
  children: ReactNode;
  active?: NavId;
};

/** @deprecated Usar AppShell. Se mantiene por compatibilidad. */
export function MobileShell({ children, active = "pantry" }: MobileShellProps) {
  return <AppShell active={active}>{children}</AppShell>;
}
