import { describe, expect, it } from 'vitest';
import {
  ACTIVE_RULE_SET,
  SOURCE_IDS,
  sourceRecords,
  sourceRecordsById
} from '$lib/rules';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

describe('rules and source metadata', () => {
  it('defines the active rules version reviewed baseline', () => {
    expect(ACTIVE_RULE_SET).toMatchObject({
      id: '2026-07-01',
      effectiveFrom: '2026-07-01',
      effectiveThrough: null,
      reviewedOn: '2026-06-18',
      status: 'active'
    });
  });

  it('records a unique official source registry with retrieval dates and URLs', () => {
    const ids = sourceRecords.map((source) => source.id);

    expect(new Set(ids).size).toBe(sourceRecords.length);
    expect(sourceRecords.length).toBeGreaterThanOrEqual(14);

    for (const source of sourceRecords) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.retrievedOn).toMatch(isoDatePattern);
      expect(source.title).toBeTruthy();
      expect(source.publisher).toBeTruthy();
    }
  });

  it('maps every active rule source id to a source record', () => {
    for (const sourceId of ACTIVE_RULE_SET.sourceIds) {
      expect(sourceRecordsById.get(sourceId)).toBeDefined();
    }
  });

  it('includes required source groups for rules, tax, platform, and accessibility', () => {
    expect(sourceRecordsById.get(SOURCE_IDS.riseFinalRule)?.sourceType).toBe(
      'federal-register'
    );
    expect(sourceRecordsById.get(SOURCE_IDS.ecfrDirectLoans)?.sourceType).toBe(
      'regulation'
    );
    expect(sourceRecordsById.get(SOURCE_IDS.irsCanceledDebt)?.publisher).toBe(
      'Internal Revenue Service'
    );
    expect(
      sourceRecordsById.get(SOURCE_IDS.svelteKitAdapterStatic)?.sourceType
    ).toBe('technical-doc');
    expect(sourceRecordsById.get(SOURCE_IDS.wcag22)?.publisher).toBe(
      'World Wide Web Consortium'
    );
  });
});
