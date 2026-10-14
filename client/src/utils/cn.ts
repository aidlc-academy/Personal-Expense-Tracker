/**
 * Minimal className utility — joins truthy class strings.
 * Avoids adding a clsx/cn dependency.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
