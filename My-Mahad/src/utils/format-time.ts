const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-11-21T08:30:00Z" → "15.30" (jam lokal perangkat). */
export function formatClock(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}.${pad(d.getMinutes())}`;
}

/** "2026-11-21T08:30:00Z" → "21/11/2026 · 15.30". */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} · ${formatClock(iso)}`;
}
