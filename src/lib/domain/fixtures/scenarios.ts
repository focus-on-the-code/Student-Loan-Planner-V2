import {
  cents,
  fieldPath,
  isoDate,
  percentage,
  type BorrowerScenario
} from '$lib/domain/types';

export const fixtureAsOfDate = isoDate('2026-07-01');
export const fixtureRulesVersion = '2026-07-01';

export const quickDirectBorrowerScenario: BorrowerScenario = {
  schemaVersion: 1,
  mode: 'quick',
  asOfDate: fixtureAsOfDate,
  loans: [],
  aggregate: {
    balanceCents: cents(55_000_00),
    weightedAverageInterestRate: percentage(6.8),
    loanProgram: 'direct',
    loanType: 'direct_unsubsidized',
    disbursementCohort: 'pre_2026_07_01'
  },
  household: {
    familySize: 1,
    taxFilingStatus: 'single',
    spouseIncomeCents: cents(0),
    spouseFederalDebtCents: cents(0),
    rapDependents: 0
  },
  income: {
    agiCents: cents(65_000_00),
    annualIncomeGrowthRate: percentage(3)
  },
  repaymentHistory: {
    currentPlanId: 'rap',
    idrMonths: 0,
    pslfQualifyingMonths: 0,
    consolidationStatus: 'not_consolidated',
    parentPlusHistory: 'none'
  },
  pslf: {
    publicServiceStatus: 'no',
    expectsFuturePublicService: 'no',
    qualifyingMonths: 0
  },
  tax: {
    estimatedFederalRate: percentage(25),
    estimatedStateRate: percentage(0)
  },
  assumptions: {
    incomeGrowthRate: percentage(3),
    povertyGrowthRate: percentage(2.5),
    rulesVersion: fixtureRulesVersion,
    projectionStartDate: fixtureAsOfDate
  },
  unknownFields: []
};

export const detailedParentPlusScenario: BorrowerScenario = {
  schemaVersion: 1,
  mode: 'detailed',
  asOfDate: fixtureAsOfDate,
  loans: [
    {
      id: 'loan-parent-plus-1',
      label: 'Parent PLUS loan',
      program: 'direct',
      type: 'direct_parent_plus',
      balanceCents: cents(32_000_00),
      interestRate: percentage(7.54),
      disbursementDate: isoDate('2021-08-15'),
      enteredRepaymentDate: isoDate('2022-02-15'),
      consolidationStatus: 'not_consolidated',
      isInDefault: false
    }
  ],
  household: {
    familySize: 2,
    taxFilingStatus: 'married_joint',
    spouseIncomeCents: cents(42_000_00),
    spouseFederalDebtCents: cents(8_000_00),
    rapDependents: 1
  },
  income: {
    agiCents: cents(92_000_00),
    annualIncomeGrowthRate: percentage(2.5)
  },
  repaymentHistory: {
    currentPlanId: 'standard',
    idrMonths: 0,
    pslfQualifyingMonths: 0,
    consolidationStatus: 'not_consolidated',
    parentPlusHistory: 'has_parent_plus'
  },
  pslf: {
    publicServiceStatus: 'unsure',
    expectsFuturePublicService: 'unsure',
    qualifyingMonths: 0
  },
  tax: {
    estimatedFederalRate: percentage(22),
    estimatedStateRate: percentage(4)
  },
  assumptions: {
    incomeGrowthRate: percentage(2.5),
    povertyGrowthRate: percentage(2.5),
    rulesVersion: fixtureRulesVersion,
    projectionStartDate: fixtureAsOfDate
  },
  unknownFields: [fieldPath('pslf.publicServiceStatus')]
};

export const fixtureScenarios = [
  quickDirectBorrowerScenario,
  detailedParentPlusScenario
] as const;
