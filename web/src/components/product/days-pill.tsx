import { formatDaysLabel, urgencyTone } from "@/lib/urgency";

type DaysPillProps = {
  days: number;
};

export function DaysPill({ days }: DaysPillProps) {
  const tone = urgencyTone(days);

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] font-bold lowercase tracking-tight"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {formatDaysLabel(days)}
    </span>
  );
}
