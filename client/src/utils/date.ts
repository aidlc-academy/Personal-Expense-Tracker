/**
 * Format an ISO date string to a readable local date.
 * e.g. "2024-01-15T00:00:00.000Z" → "15 Jan 2024"
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date for <input type="date"> value attribute (YYYY-MM-DD)
 */
export function toInputDateValue(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]!;
}

/**
 * Month name from 1-indexed month number.
 */
export function monthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString('en-IN', { month: 'long' });
}

/**
 * Current month/year as { month: number, year: number }
 */
export function currentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}
