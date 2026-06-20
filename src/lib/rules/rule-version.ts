import { SOURCE_IDS } from '$lib/rules/sources';
import type { RuleSetMetadata } from '$lib/rules/types';

export const ACTIVE_RULE_SET: RuleSetMetadata = {
  id: '2026-07-01',
  effectiveFrom: '2026-07-01',
  effectiveThrough: null,
  reviewedOn: '2026-06-18',
  status: 'active',
  sourceIds: [
    SOURCE_IDS.riseFinalRule,
    SOURCE_IDS.fsaBigUpdates,
    SOURCE_IDS.ecfrDirectLoans,
    SOURCE_IDS.ecfrFfel,
    SOURCE_IDS.ecfrPerkins,
    SOURCE_IDS.icrAnnualUpdate2026,
    SOURCE_IDS.fsaPslf,
    SOURCE_IDS.hhsPovertyGuidelines,
    SOURCE_IDS.irsCanceledDebt,
    SOURCE_IDS.taxpayerAdvocateForgivenessTaxes
  ],
  notes: [
    'Rules reviewed through June 18, 2026.',
    'Metadata only; calculation formulas and annual data tables are implemented separately.',
    'Source pages can change after retrieval and must be manually reviewed before each public-beta release.'
  ]
};

export const RULE_STALENESS_MONTHS = 12;
export const RULE_STALENESS_WARNING =
  'These repayment rules have not been reviewed in more than 12 months. Confirm current options through Federal Student Aid before relying on this estimate.';
