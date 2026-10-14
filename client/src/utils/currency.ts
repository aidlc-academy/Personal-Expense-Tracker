/**
 * Format paise (integer) as INR string, e.g. 150000 → ₹1,500.00
 */
export function formatCurrency(paise: number, currency = 'INR'): string {
  const amount = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a rupee amount (as a float/string) into paise integer.
 * e.g. "1500.50" → 150050
 */
export function rupeesToPaise(rupees: string | number): number {
  const amount = typeof rupees === 'string' ? parseFloat(rupees) : rupees;
  if (isNaN(amount) || amount < 0) return 0;
  return Math.round(amount * 100);
}

/**
 * Convert paise to rupees as a decimal string for form inputs.
 * e.g. 150050 → "1500.50"
 */
export function paiseToRupees(paise: number): string {
  return (paise / 100).toFixed(2);
}
