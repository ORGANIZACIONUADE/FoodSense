import { Card } from "@/components/ui/card";
import { InventoryLegend } from "./inventory-legend";

type InventorySummaryProps = {
  total: number;
  urgentCount: number;
};

export function InventorySummary({
  total,
  urgentCount,
}: InventorySummaryProps) {
  return (
    <Card className="p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
        Resumen
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{total}</p>
      <p className="text-sm text-ink-soft">productos en despensa</p>

      <div className="mt-5 rounded-lg bg-surface-alt px-4 py-3">
        <p className="text-sm font-semibold text-ink">
          {urgentCount > 0
            ? `${urgentCount} requieren atención`
            : "Todo al día"}
        </p>
        <p className="mt-1 text-xs text-ink-soft">
          Ordenados por urgencia de vencimiento
        </p>
      </div>

      <div className="mt-5 border-t border-border-soft pt-4">
        <InventoryLegend className="flex-col gap-2.5" />
      </div>
    </Card>
  );
}
