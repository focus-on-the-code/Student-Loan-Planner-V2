export type Brand<K, T> = K & { readonly __brand: T };

export type IsoDateString = Brand<string, 'IsoDateString'>;
export type Cents = Brand<number, 'Cents'>;
export type Percentage = Brand<number, 'Percentage'>;
export type SourceId = Brand<string, 'SourceId'>;
export type ScenarioFieldPath = Brand<string, 'ScenarioFieldPath'>;

export const PLAN_IDS = [
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
] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export type ScenarioMode = 'quick' | 'detailed';
export type EstimatorStage = 'landing' | 'onboarding' | 'results';
export type CalculationStatus = 'idle' | 'calculating' | 'ready' | 'error';
export type EstimateQuality = 'basic' | 'improved' | 'detailed';

export type LoanProgram = 'direct' | 'ffel' | 'perkins' | 'mixed' | 'unknown';

export type LoanType =
  | 'direct_subsidized'
  | 'direct_unsubsidized'
  | 'direct_grad_plus'
  | 'direct_parent_plus'
  | 'direct_consolidation'
  | 'ffel_subsidized'
  | 'ffel_unsubsidized'
  | 'ffel_plus'
  | 'ffel_consolidation'
  | 'perkins'
  | 'unknown';

export type TaxFilingStatus =
  | 'single'
  | 'married_joint'
  | 'married_separate'
  | 'head_of_household'
  | 'qualifying_surviving_spouse'
  | 'unknown';

export type PublicServiceStatus = 'yes' | 'no' | 'unsure';
export type ConsolidationStatus =
  | 'not_consolidated'
  | 'consolidated'
  | 'unsure';
export type ParentPlusHistory =
  | 'none'
  | 'has_parent_plus'
  | 'double_consolidated'
  | 'unknown';
export type DisbursementCohort =
  | 'pre_2026_07_01'
  | 'post_2026_07_01'
  | 'mixed'
  | 'unknown';

export interface AggregateLoanInput {
  readonly balanceCents: Cents;
  readonly weightedAverageInterestRate: Percentage;
  readonly loanProgram: LoanProgram;
  readonly loanType: LoanType;
  readonly disbursementCohort: DisbursementCohort;
}

export interface LoanInput {
  readonly id: string;
  readonly label: string;
  readonly program: LoanProgram;
  readonly type: LoanType;
  readonly balanceCents: Cents;
  readonly interestRate: Percentage;
  readonly disbursementDate: IsoDateString | null;
  readonly enteredRepaymentDate: IsoDateString | null;
  readonly consolidationStatus: ConsolidationStatus;
  readonly isInDefault: boolean;
}

export interface HouseholdInput {
  readonly familySize: number;
  readonly taxFilingStatus: TaxFilingStatus;
  readonly spouseIncomeCents: Cents;
  readonly spouseFederalDebtCents: Cents;
  readonly rapDependents: number;
}

export interface IncomeProjectionInput {
  readonly agiCents: Cents;
  readonly annualIncomeGrowthRate: Percentage;
}

export interface RepaymentHistoryInput {
  readonly currentPlanId: PlanId | null;
  readonly idrMonths: number;
  readonly pslfQualifyingMonths: number;
  readonly consolidationStatus: ConsolidationStatus;
  readonly parentPlusHistory: ParentPlusHistory;
}

export interface PslfInput {
  readonly publicServiceStatus: PublicServiceStatus;
  readonly expectsFuturePublicService: PublicServiceStatus;
  readonly qualifyingMonths: number;
}

export interface ForgivenessTaxInput {
  readonly estimatedFederalRate: Percentage;
  readonly estimatedStateRate: Percentage;
}

export interface ProjectionAssumptions {
  readonly incomeGrowthRate: Percentage;
  readonly povertyGrowthRate: Percentage;
  readonly rulesVersion: string;
  readonly projectionStartDate: IsoDateString;
}

export interface BorrowerScenario {
  readonly schemaVersion: 1;
  readonly mode: ScenarioMode;
  readonly asOfDate: IsoDateString;
  readonly loans: readonly LoanInput[];
  readonly aggregate?: AggregateLoanInput;
  readonly household: HouseholdInput;
  readonly income: IncomeProjectionInput;
  readonly repaymentHistory: RepaymentHistoryInput;
  readonly pslf: PslfInput;
  readonly tax: ForgivenessTaxInput;
  readonly assumptions: ProjectionAssumptions;
  readonly unknownFields: readonly ScenarioFieldPath[];
}

export type EligibilityStatus =
  | 'eligible'
  | 'potentially_eligible'
  | 'ineligible'
  | 'unavailable';
export type EligibilityReasonCode = Brand<string, 'EligibilityReasonCode'>;

export interface EligibilityResult {
  readonly planId: PlanId;
  readonly status: EligibilityStatus;
  readonly reasonCodes: readonly EligibilityReasonCode[];
  readonly userMessage: string;
  readonly missingFields: readonly ScenarioFieldPath[];
  readonly effectiveRuleVersion: string;
  readonly sourceIds: readonly SourceId[];
}

export type ProjectedResolutionType =
  | 'paid_off'
  | 'idr_forgiveness'
  | 'pslf'
  | 'term_end';
export type ProjectionWarning = Brand<string, 'ProjectionWarning'>;

export interface AppliedAssumption {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly sourceIds: readonly SourceId[];
}

export interface YearProjection {
  readonly year: number;
  readonly startingBalanceCents: Cents;
  readonly annualPaymentCents: Cents;
  readonly interestAccruedCents: Cents;
  readonly endingBalanceCents: Cents;
  readonly forgivenessCents: Cents;
}

export interface ProjectionAuditSummary {
  readonly simulatedMonths: number;
  readonly totalPrincipalPaidCents: Cents;
  readonly totalInterestPaidCents: Cents;
  readonly totalForgivenessCents: Cents;
}

export interface PlanProjection {
  readonly planId: PlanId;
  readonly eligibility: EligibilityResult;
  readonly estimateQuality: EstimateQuality;
  readonly monthlyPaymentNowCents: Cents;
  readonly annualPaymentNowCents: Cents;
  readonly year5MonthlyPaymentCents: Cents | null;
  readonly highestMonthlyPaymentCents: Cents;
  readonly totalBorrowerPaymentsCents: Cents;
  readonly totalInterestPaidCents: Cents;
  readonly endingBalanceCents: Cents;
  readonly estimatedForgivenessCents: Cents;
  readonly estimatedFederalForgivenessTaxCents: Cents;
  readonly estimatedStateForgivenessTaxCents: Cents;
  readonly projectedResolutionMonth: number;
  readonly projectedResolutionType: ProjectedResolutionType;
  readonly waivedInterestCents: Cents;
  readonly planCreditsCents: Cents;
  readonly yearly: readonly YearProjection[];
  readonly warnings: readonly ProjectionWarning[];
  readonly assumptions: readonly AppliedAssumption[];
  readonly audit: ProjectionAuditSummary;
  readonly sourceIds: readonly SourceId[];
}

export interface ValidationMessage {
  readonly field: ScenarioFieldPath;
  readonly severity: 'error' | 'warning' | 'info';
  readonly message: string;
}

export interface ValidationState {
  readonly isValid: boolean;
  readonly messages: readonly ValidationMessage[];
}

export interface ScenarioResults {
  readonly scenarioId: string;
  readonly generatedAt: IsoDateString;
  readonly rulesVersion: string;
  readonly projections: readonly PlanProjection[];
}

export interface EstimatorState {
  readonly schemaVersion: 1;
  readonly mode: ScenarioMode;
  readonly stage: EstimatorStage;
  readonly scenario: BorrowerScenario;
  readonly validation: ValidationState;
  readonly results: ScenarioResults | null;
  readonly calculationStatus: CalculationStatus;
  readonly expandedAllPlans: boolean;
  readonly selectedChartPlanIds: readonly PlanId[];
  readonly estimateQuality: EstimateQuality;
  readonly undoAvailable: boolean;
}

export const cents = (value: number): Cents => value as Cents;
export const percentage = (value: number): Percentage => value as Percentage;
export const isoDate = (value: string): IsoDateString => value as IsoDateString;
export const fieldPath = (value: string): ScenarioFieldPath =>
  value as ScenarioFieldPath;
export const sourceId = (value: string): SourceId => value as SourceId;
