import { describe, it, expect } from 'vitest';
import { formatCurrency, rupeesToPaise, paiseToRupees } from '../utils/currency';

describe('formatCurrency', () => {
  it('formats zero paise', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
    expect(result).toContain('₹');
  });

  it('formats 100 paise as ₹1.00', () => {
    const result = formatCurrency(100);
    expect(result).toContain('1');
  });

  it('formats 8500000 paise as ₹85,000.00', () => {
    const result = formatCurrency(8500000);
    expect(result).toContain('85');
    expect(result).toContain('000');
  });

  it('formats negative paise (balance deficit)', () => {
    const result = formatCurrency(-10000);
    expect(result).toContain('100');
  });
});

describe('rupeesToPaise', () => {
  it('converts 1.00 to 100', () => expect(rupeesToPaise('1.00')).toBe(100));
  it('converts 1500.50 to 150050', () => expect(rupeesToPaise('1500.50')).toBe(150050));
  it('converts 0 to 0', () => expect(rupeesToPaise(0)).toBe(0));
  it('handles invalid string', () => expect(rupeesToPaise('abc')).toBe(0));
  it('rounds correctly', () => expect(rupeesToPaise('1.999')).toBe(200));
});

describe('paiseToRupees', () => {
  it('converts 100 paise to "1.00"', () => expect(paiseToRupees(100)).toBe('1.00'));
  it('converts 150050 to "1500.50"', () => expect(paiseToRupees(150050)).toBe('1500.50'));
  it('converts 0 to "0.00"', () => expect(paiseToRupees(0)).toBe('0.00'));
});
