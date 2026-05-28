type InventoryLegendProps = {
  className?: string;
};

export function InventoryLegend({ className = "" }: InventoryLegendProps) {
  return (
    <div
      className={`flex flex-wrap gap-3 text-[11px] text-ink-mute ${className}`}
      aria-label="Leyenda de urgencia"
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red" aria-hidden />
        Urgente (hoy / mañana)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-amber" aria-hidden />
        Pronto (2–4 días)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green" aria-hidden />
        A tiempo
      </span>
    </div>
  );
}
