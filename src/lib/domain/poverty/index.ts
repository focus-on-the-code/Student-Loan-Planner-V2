import { cents, type Cents } from '$lib/domain/types';

export type PovertyGuidelineRegion = 'contiguous' | 'alaska' | 'hawaii';

export interface PovertyGuidelineTable {
  readonly year: number;
  readonly sourceId: string;
  readonly baseByRegionCents: Readonly<Record<PovertyGuidelineRegion, Cents>>;
  readonly additionalPersonByRegionCents: Readonly<
    Record<PovertyGuidelineRegion, Cents>
  >;
}

export const POVERTY_GUIDELINES_2026: PovertyGuidelineTable = {
  year: 2026,
  sourceId: 'hhs-aspe-2026-poverty-guidelines',
  baseByRegionCents: {
    contiguous: cents(15_960_00),
    alaska: cents(19_950_00),
    hawaii: cents(18_360_00)
  },
  additionalPersonByRegionCents: {
    contiguous: cents(5_680_00),
    alaska: cents(7_100_00),
    hawaii: cents(6_530_00)
  }
};

export const getPovertyGuidelineCents = (
  familySize: number,
  region: PovertyGuidelineRegion = 'contiguous',
  table = POVERTY_GUIDELINES_2026
): Cents => {
  if (!Number.isInteger(familySize) || familySize < 1) {
    throw new Error('Family size must be a positive integer.');
  }

  return cents(
    table.baseByRegionCents[region] +
      table.additionalPersonByRegionCents[region] * Math.max(0, familySize - 1)
  );
};

export const getPovertyMultipleCents = (
  familySize: number,
  multiple: number,
  region: PovertyGuidelineRegion = 'contiguous',
  table = POVERTY_GUIDELINES_2026
): Cents =>
  cents(
    Math.round(getPovertyGuidelineCents(familySize, region, table) * multiple)
  );
