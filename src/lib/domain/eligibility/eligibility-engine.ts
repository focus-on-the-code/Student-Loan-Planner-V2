import {
  fieldPath,
  type BorrowerScenario,
  type EligibilityReasonCode,
  type EligibilityResult,
  type LoanProgram,
  type LoanType,
  type PlanId,
  type ScenarioFieldPath,
  type SourceId
} from '$lib/domain/types';
import { ACTIVE_RULE_SET } from '$lib/rules/rule-version';
import { SOURCE_IDS } from '$lib/rules/sources';

export interface EligibilityContext {
  readonly scenario: BorrowerScenario;
  readonly ruleVersion: string;
  readonly ruleSourceIds: readonly SourceId[];
  readonly totalBalanceCents: number;
  readonly programs: ReadonlySet<LoanProgram>;
  readonly loanTypes: ReadonlySet<LoanType>;
  readonly hasDefaultedLoan: boolean;
  readonly hasParentPlus: boolean;
  readonly hasDirectLoan: boolean;
  readonly hasFfelLoan: boolean;
  readonly hasPerkinsLoan: boolean;
  readonly isAggregateOnly: boolean;
}

const reasonCode = (value: string): EligibilityReasonCode =>
  value as EligibilityReasonCode;

const directPlanSourceIds = [
  SOURCE_IDS.riseFinalRule,
  SOURCE_IDS.ecfrDirectLoans,
  SOURCE_IDS.fsaBigUpdates
] as const;

const fixedPlanSourceIds = [
  SOURCE_IDS.ecfrDirectLoans,
  SOURCE_IDS.ecfrFfel,
  SOURCE_IDS.ecfrPerkins
] as const;

const parentPlusSourceIds = [
  SOURCE_IDS.ecfrDirectLoans,
  SOURCE_IDS.fsaBigUpdates
] as const;

const createEligibility = (
  planId: PlanId,
  status: EligibilityResult['status'],
  reasonCodes: readonly string[],
  userMessage: string,
  missingFields: readonly ScenarioFieldPath[],
  sourceIds: readonly SourceId[]
): EligibilityResult => ({
  planId,
  status,
  reasonCodes: reasonCodes.map(reasonCode),
  userMessage,
  missingFields,
  effectiveRuleVersion: ACTIVE_RULE_SET.id,
  sourceIds
});

export const createEligibilityContext = (
  scenario: BorrowerScenario
): EligibilityContext => {
  const loanPrograms = scenario.loans.map((loan) => loan.program);
  const loanTypes = scenario.loans.map((loan) => loan.type);
  const aggregateProgram = scenario.aggregate?.loanProgram;
  const aggregateType = scenario.aggregate?.loanType;
  const programs = new Set<LoanProgram>([
    ...loanPrograms,
    ...(aggregateProgram ? [aggregateProgram] : [])
  ]);
  const types = new Set<LoanType>([
    ...loanTypes,
    ...(aggregateType ? [aggregateType] : [])
  ]);
  const loanBalance = scenario.loans.reduce(
    (sum, loan) => sum + loan.balanceCents,
    0
  );
  const totalBalanceCents =
    loanBalance + (scenario.aggregate?.balanceCents ?? 0);

  return {
    scenario,
    ruleVersion: ACTIVE_RULE_SET.id,
    ruleSourceIds: ACTIVE_RULE_SET.sourceIds,
    totalBalanceCents,
    programs,
    loanTypes: types,
    hasDefaultedLoan: scenario.loans.some((loan) => loan.isInDefault),
    hasParentPlus:
      types.has('direct_parent_plus') ||
      scenario.repaymentHistory.parentPlusHistory === 'has_parent_plus',
    hasDirectLoan: programs.has('direct') || programs.has('mixed'),
    hasFfelLoan: programs.has('ffel') || programs.has('mixed'),
    hasPerkinsLoan: programs.has('perkins') || programs.has('mixed'),
    isAggregateOnly: scenario.loans.length === 0 && Boolean(scenario.aggregate)
  };
};

const missingHistoricalFields = (context: EligibilityContext) => {
  const missing = [...context.scenario.unknownFields];

  if (context.isAggregateOnly) {
    missing.push(fieldPath('loans'));
  }

  return missing;
};

const hasPositiveBalance = (context: EligibilityContext, planId: PlanId) => {
  if (context.totalBalanceCents > 0) {
    return null;
  }

  return createEligibility(
    planId,
    'ineligible',
    ['no-balance'],
    'No outstanding federal student loan balance was entered.',
    [],
    fixedPlanSourceIds
  );
};

const defaultedLoanResult = (context: EligibilityContext, planId: PlanId) => {
  if (!context.hasDefaultedLoan) {
    return null;
  }

  return createEligibility(
    planId,
    'potentially_eligible',
    ['default-status-needs-official-review'],
    'At least one loan is marked in default, so repayment-plan availability requires official servicer or Federal Student Aid confirmation.',
    [],
    context.ruleSourceIds
  );
};

const fixedPlanEligibility = (context: EligibilityContext, planId: PlanId) => {
  return (
    hasPositiveBalance(context, planId) ??
    defaultedLoanResult(context, planId) ??
    createEligibility(
      planId,
      'eligible',
      ['federal-loan-balance-entered'],
      'This fixed repayment plan can be estimated from the federal loan balance entered.',
      [],
      fixedPlanSourceIds
    )
  );
};

const extendedEligibility = (context: EligibilityContext, planId: PlanId) => {
  const baseFailure =
    hasPositiveBalance(context, planId) ?? defaultedLoanResult(context, planId);

  if (baseFailure) {
    return baseFailure;
  }

  if (context.totalBalanceCents < 30_000_00) {
    return createEligibility(
      planId,
      'ineligible',
      ['extended-balance-threshold-not-met'],
      'Extended repayment generally requires more than $30,000 in eligible federal loan debt.',
      [],
      fixedPlanSourceIds
    );
  }

  return createEligibility(
    planId,
    'eligible',
    ['extended-balance-threshold-met'],
    'The entered balance meets the estimator threshold for extended repayment.',
    [],
    fixedPlanSourceIds
  );
};

const rapEligibility = (context: EligibilityContext) => {
  const baseFailure =
    hasPositiveBalance(context, 'rap') ?? defaultedLoanResult(context, 'rap');

  if (baseFailure) {
    return baseFailure;
  }

  if (context.hasParentPlus) {
    return createEligibility(
      'rap',
      'potentially_eligible',
      ['parent-plus-transition-review-needed'],
      'Parent PLUS history can limit RAP availability, so this scenario needs transition-route review.',
      missingHistoricalFields(context),
      parentPlusSourceIds
    );
  }

  if (!context.hasDirectLoan) {
    return createEligibility(
      'rap',
      'ineligible',
      ['direct-loan-required'],
      'RAP is modeled for eligible Direct Loan borrowers in this estimator baseline.',
      [],
      directPlanSourceIds
    );
  }

  if (context.scenario.aggregate?.disbursementCohort === 'unknown') {
    return createEligibility(
      'rap',
      'potentially_eligible',
      ['missing-disbursement-cohort'],
      'RAP availability may depend on loan dates that were not entered.',
      [fieldPath('aggregate.disbursementCohort')],
      directPlanSourceIds
    );
  }

  return createEligibility(
    'rap',
    'eligible',
    ['direct-loan-rap-baseline'],
    'The entered Direct Loan scenario can be evaluated for RAP under the active rules metadata.',
    [],
    directPlanSourceIds
  );
};

const idrEligibility = (
  context: EligibilityContext,
  planId: 'ibr_10' | 'ibr_15' | 'paye' | 'icr'
) => {
  const baseFailure =
    hasPositiveBalance(context, planId) ?? defaultedLoanResult(context, planId);

  if (baseFailure) {
    return baseFailure;
  }

  if (planId === 'paye') {
    return createEligibility(
      planId,
      'potentially_eligible',
      ['paye-grandfathering-facts-required'],
      'PAYE depends on historical borrower facts and should be treated as potentially eligible until those facts are confirmed.',
      missingHistoricalFields(context),
      directPlanSourceIds
    );
  }

  if (planId === 'icr' && context.hasParentPlus) {
    return createEligibility(
      planId,
      'potentially_eligible',
      ['parent-plus-consolidation-route-required'],
      'ICR may be available for Parent PLUS borrowers only through qualifying consolidation pathways.',
      missingHistoricalFields(context),
      parentPlusSourceIds
    );
  }

  if (!context.hasDirectLoan && !context.hasFfelLoan) {
    return createEligibility(
      planId,
      'ineligible',
      ['idr-loan-program-required'],
      'This income-driven repayment option requires eligible Direct or FFEL loan history.',
      [],
      directPlanSourceIds
    );
  }

  if (context.isAggregateOnly && context.scenario.unknownFields.length > 0) {
    return createEligibility(
      planId,
      'potentially_eligible',
      ['loan-level-history-missing'],
      'Loan-level dates or repayment-history facts may affect this plan, so eligibility is only potential.',
      missingHistoricalFields(context),
      directPlanSourceIds
    );
  }

  return createEligibility(
    planId,
    'eligible',
    ['idr-baseline-eligible'],
    'The entered federal loan scenario can be evaluated for this income-driven repayment option.',
    [],
    directPlanSourceIds
  );
};

const ffelIncomeSensitiveEligibility = (context: EligibilityContext) => {
  if (!context.hasFfelLoan) {
    return createEligibility(
      'ffel_income_sensitive',
      'ineligible',
      ['ffel-loan-required'],
      'FFEL Income-Sensitive Repayment applies to FFEL loans, which were not entered for this scenario.',
      [],
      [SOURCE_IDS.ecfrFfel]
    );
  }

  return createEligibility(
    'ffel_income_sensitive',
    context.hasDirectLoan || context.hasPerkinsLoan
      ? 'potentially_eligible'
      : 'eligible',
    ['ffel-income-sensitive-lender-formula'],
    'FFEL Income-Sensitive Repayment depends on lender-specific formula limits and is shown with estimator limitations.',
    context.hasDirectLoan || context.hasPerkinsLoan
      ? missingHistoricalFields(context)
      : [],
    [SOURCE_IDS.ecfrFfel]
  );
};

const perkinsEligibility = (context: EligibilityContext) => {
  if (!context.hasPerkinsLoan) {
    return createEligibility(
      'perkins_standard',
      'ineligible',
      ['perkins-loan-required'],
      'Perkins repayment applies to Perkins loans, which were not entered for this scenario.',
      [],
      [SOURCE_IDS.ecfrPerkins]
    );
  }

  return createEligibility(
    'perkins_standard',
    context.hasDirectLoan || context.hasFfelLoan
      ? 'potentially_eligible'
      : 'eligible',
    ['perkins-servicer-or-school-review'],
    'Perkins repayment can vary by school or servicer and should be confirmed before relying on the estimate.',
    context.hasDirectLoan || context.hasFfelLoan
      ? missingHistoricalFields(context)
      : [],
    [SOURCE_IDS.ecfrPerkins]
  );
};

export const evaluatePlanEligibility = (
  scenario: BorrowerScenario,
  planId: PlanId
): EligibilityResult => {
  const context = createEligibilityContext(scenario);

  switch (planId) {
    case 'rap':
      return rapEligibility(context);
    case 'tiered_standard':
    case 'standard':
    case 'graduated':
      return fixedPlanEligibility(context, planId);
    case 'extended_fixed':
    case 'extended_graduated':
      return extendedEligibility(context, planId);
    case 'ibr_10':
    case 'ibr_15':
    case 'paye':
    case 'icr':
      return idrEligibility(context, planId);
    case 'ffel_income_sensitive':
      return ffelIncomeSensitiveEligibility(context);
    case 'perkins_standard':
      return perkinsEligibility(context);
    case 'alternative_informational':
      return createEligibility(
        planId,
        'unavailable',
        ['informational-only-no-formula'],
        'Alternative repayment is individually determined and is shown for information only, without an invented payment formula.',
        [],
        context.ruleSourceIds
      );
    case 'save_unavailable':
      return createEligibility(
        planId,
        'unavailable',
        ['save-repaye-historical-unavailable'],
        'SAVE/REPAYE is treated as historical or unavailable under the active rules metadata.',
        [],
        [SOURCE_IDS.fsaBigUpdates, SOURCE_IDS.riseFinalRule]
      );
  }
};

export const evaluateScenarioEligibility = (scenario: BorrowerScenario) =>
  scenario.assumptions.rulesVersion === ACTIVE_RULE_SET.id
    ? scenarioPlanOrder.map((planId) =>
        evaluatePlanEligibility(scenario, planId)
      )
    : scenarioPlanOrder.map((planId) =>
        createEligibility(
          planId,
          'potentially_eligible',
          ['rules-version-mismatch'],
          'The scenario was created with a different rules version and should be reviewed before eligibility is treated as final.',
          [fieldPath('assumptions.rulesVersion')],
          ACTIVE_RULE_SET.sourceIds
        )
      );

export const scenarioPlanOrder: readonly PlanId[] = [
  'rap',
  'tiered_standard',
  'standard',
  'graduated',
  'extended_fixed',
  'extended_graduated',
  'ibr_10',
  'ibr_15',
  'paye',
  'icr',
  'ffel_income_sensitive',
  'perkins_standard',
  'alternative_informational',
  'save_unavailable'
];
