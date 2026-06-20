import { cents, type Cents, type Percentage } from '$lib/domain/types';

export const ZERO_CENTS = cents(0);

export const addCents = (...values: readonly Cents[]): Cents =>
  cents(values.reduce((sum, value) => sum + value, 0));

export const subtractCents = (left: Cents, right: Cents): Cents =>
  cents(left - right);

export const clampCentsAtZero = (value: Cents): Cents =>
  cents(Math.max(0, value));

export const multiplyCents = (value: Cents, multiplier: number): Cents =>
  cents(Math.round(value * multiplier));

export const percentageOfCents = (
  value: Cents,
  percentage: Percentage
): Cents => cents(Math.round((value * percentage) / 100));

export const dollarsToCents = (dollars: number): Cents =>
  cents(Math.round(dollars * 100));

export const centsToDollars = (value: Cents): number => value / 100;

export const monthlyRateFromAnnualPercentage = (
  annualRate: Percentage
): number => annualRate / 100 / 12;

export const formatCents = (value: Cents): string => {
  const sign = value < 0 ? '-' : '';
  const absolute = Math.abs(value);
  const dollars = Math.floor(absolute / 100).toLocaleString('en-US');
  const centsPart = String(absolute % 100).padStart(2, '0');
  return `${sign}$${dollars}.${centsPart}`;
};
