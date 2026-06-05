import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../lib/format';
import { getMonthKey, getTodayString } from '../lib/date';

describe('Format Utils', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1234.5)).toBe('₹1,234.50');
    expect(formatCurrency(0)).toBe('₹0.00');
  });
});

describe('Date Utils', () => {
  it('returns correctly formatted month key', () => {
    const key = getMonthKey();
    expect(key).toMatch(/^\d{4}-\d{2}$/);
  });

  it('returns today as YYYY-MM-DD', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
