export type UrgencyTone = {
  fg: string;
  bg: string;
  wash: string;
  label: "urgente" | "pronto" | "a tiempo";
};

/** Mapeo urgencia → color (HANDOFF: ≤1 rojo, ≤4 ámbar, >4 verde). */
export function urgencyTone(days: number): UrgencyTone {
  if (days <= 1) {
    return {
      fg: "#D85B4A",
      bg: "#FADDD6",
      wash: "#FDEEEA",
      label: "urgente",
    };
  }
  if (days <= 4) {
    return {
      fg: "#E89F4D",
      bg: "#FBE9D2",
      wash: "#FDF5EB",
      label: "pronto",
    };
  }
  return {
    fg: "#2F8F5C",
    bg: "#E5F1E8",
    wash: "#F2F8F3",
    label: "a tiempo",
  };
}

export function formatDaysLabel(days: number): string {
  if (days === 0) return "hoy";
  if (days === 1) return "mañana";
  if (days < 7) return `${days} días`;
  if (days < 30) return `${Math.round(days / 7)} sem`;
  return `${Math.round(days / 30)} mes`;
}
