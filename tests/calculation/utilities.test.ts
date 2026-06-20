import { describe, expect, it } from 'vitest';
import {
  addCents,
  addMonths,
  buildFixedAmortizationSchedule,
  calculateFixedMonthlyPaymentCents,
  cents,
  centsToDollars,
  dollarsToCents,
  formatCents,
  getPovertyGuidelineCents,
  getPovertyMultipleCents,
  isoDate,
  isAfterIsoDate,
  isIsoDateString,
  percentage,
  percentageOfCents,
  wholeMonthsBetween
} from '$lib/domain';

describe('money utilities', () => {
  it('converts, adds, formats, and applies percentages with cent rounding', () => {
    expect(dollarsToCents(12.345)).toBe(cents(1235));
    expect(centsToDollars(cents(1235))).toBe(12.35);
    expect(addCents(cents(100), cents(250), cents(25))).toBe(cents(375));
    expect(percentageOfCents(cents(12_345), percentage(10))).toBe(cents(1235));
    expect(formatCents(cents(-123_456))).toBe('-$1,234.56');
  });
});

describe('date utilities', () => {
  it('validates and performs month arithmetic on ISO dates', () => {
    expect(isIsoDateString('2026-07-01')).toBe(true);
    expect(isIsoDateString('07/01/2026')).toBe(false);
    expect(addMonths(isoDate('2026-07-01'), 6)).toBe('2027-01-01');
    expect(
      wholeMonthsBetween(isoDate('2026-07-15'), isoDate('2026-08-14'))
    ).toBe(0);
    expect(
      wholeMonthsBetween(isoDate('2026-07-15'), isoDate('2026-08-15'))
    ).toBe(1);
    expect(isAfterIsoDate(isoDate('2026-08-01'), isoDate('2026-07-31'))).toBe(
      true
    );
  });
});

describe('poverty-guideline utilities', () => {
  it('returns 2026 HHS poverty guideline values by region and family size', () => {
    expect(getPovertyGuidelineCents(1, 'contiguous')).toBe(cents(15_960_00));
    expect(getPovertyGuidelineCents(2, 'contiguous')).toBe(cents(21_640_00));
    expect(getPovertyGuidelineCents(2, 'alaska')).toBe(cents(27_050_00));
    expect(getPovertyGuidelineCents(2, 'hawaii')).toBe(cents(24_890_00));
    expect(getPovertyGuidelineCents(9, 'contiguous')).toBe(cents(61_400_00));
  });

  it('calculates poverty multiples with rounding', () => {
    expect(getPovertyMultipleCents(1, 1.5, 'contiguous')).toBe(
      cents(23_940_00)
    );
  });

  it('rejects invalid family sizes', () => {
    expect(() => getPovertyGuidelineCents(0)).toThrow(
      'Family size must be a positive integer.'
    );
  });
});

describe('amortization utilities', () => {
  it('calculates a fixed monthly payment and amortizes to payoff', () => {
    const monthlyPayment = calculateFixedMonthlyPaymentCents(
      cents(10_000_00),
      percentage(6),
      120
    );
    const schedule = buildFixedAmortizationSchedule(
      cents(10_000_00),
      percentage(6),
      120,
      monthlyPayment
    );

    expect(monthlyPayment).toBeGreaterThan(cents(0));
    expect(schedule.paidOff).toBe(true);
    expect(schedule.months.at(-1)?.endingBalanceCents).toBe(cents(0));
    expect(schedule.totalPaidCents).toBeGreaterThan(cents(10_000_00));
    expect(schedule.totalInterestCents).toBeGreaterThan(cents(0));
  });

  it('handles zero-interest and zero-principal cases', () => {
    expect(
      calculateFixedMonthlyPaymentCents(cents(0), percentage(6), 120)
    ).toBe(cents(0));
    expect(
      calculateFixedMonthlyPaymentCents(cents(1_200_00), percentage(0), 12)
    ).toBe(cents(100_00));
  });

  it('rejects invalid amortization terms', () => {
    expect(() =>
      calculateFixedMonthlyPaymentCents(cents(1_200_00), percentage(0), 0)
    ).toThrow('Term months must be a positive integer.');
  });
});
