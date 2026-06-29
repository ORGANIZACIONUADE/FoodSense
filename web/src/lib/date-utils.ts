/** Converts a relative day count into a YYYY-MM-DD date string for storage. */
export function toExpiresAt(daysUntilExpiry: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysUntilExpiry);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Converts a YYYY-MM-DD date string from storage back to a relative day count. */
export function toDaysUntilExpiry(expiresAt: string): number {
  const [year, month, day] = expiresAt.split("-").map(Number);
  const expires = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((expires.getTime() - today.getTime()) / 86400000);
}
