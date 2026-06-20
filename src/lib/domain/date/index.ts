import { isoDate, type IsoDateString } from '$lib/domain/types';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const isIsoDateString = (value: string): value is IsoDateString =>
  isoDatePattern.test(value);

export const parseIsoDateParts = (value: IsoDateString) => {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month, day };
};

export const addMonths = (
  value: IsoDateString,
  months: number
): IsoDateString => {
  const { year, month, day } = parseIsoDateParts(value);
  const date = new Date(Date.UTC(year, month - 1 + months, day));
  return isoDate(date.toISOString().slice(0, 10));
};

export const wholeMonthsBetween = (
  start: IsoDateString,
  end: IsoDateString
): number => {
  const startParts = parseIsoDateParts(start);
  const endParts = parseIsoDateParts(end);
  const monthDelta =
    (endParts.year - startParts.year) * 12 +
    (endParts.month - startParts.month);
  return endParts.day < startParts.day ? monthDelta - 1 : monthDelta;
};

export const isAfterIsoDate = (
  left: IsoDateString,
  right: IsoDateString
): boolean => left > right;
