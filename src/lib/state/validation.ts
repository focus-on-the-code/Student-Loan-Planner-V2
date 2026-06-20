import {
  fieldPath,
  type BorrowerScenario,
  type EstimateQuality,
  type ScenarioFieldPath,
  type ValidationMessage,
  type ValidationState
} from '$lib/domain';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const createMessage = (
  field: string,
  severity: ValidationMessage['severity'],
  message: string
): ValidationMessage => ({
  field: fieldPath(field),
  severity,
  message
});

const isNonNegative = (value: number) => Number.isFinite(value) && value >= 0;
const isIntegerInRange = (value: number, min: number, max: number) =>
  Number.isInteger(value) && value >= min && value <= max;
const isPercentInRange = (value: number, min = 0, max = 100) =>
  Number.isFinite(value) && value >= min && value <= max;
const isIsoDate = (value: string | null) =>
  value === null || isoDatePattern.test(value);

export const validateScenario = (
  scenario: BorrowerScenario
): ValidationState => {
  const messages: ValidationMessage[] = [];

  if (scenario.schemaVersion !== 1) {
    messages.push(
      createMessage(
        'schemaVersion',
        'error',
        'Scenario schema version is not supported.'
      )
    );
  }

  if (!isoDatePattern.test(scenario.asOfDate)) {
    messages.push(
      createMessage(
        'asOfDate',
        'error',
        'Estimate date must use YYYY-MM-DD format.'
      )
    );
  }

  if (
    scenario.mode === 'quick' &&
    !scenario.aggregate &&
    scenario.loans.length === 0
  ) {
    messages.push(
      createMessage(
        'aggregate.balanceCents',
        'error',
        'Quick estimates require an aggregate balance.'
      )
    );
  }

  if (scenario.mode === 'detailed' && scenario.loans.length === 0) {
    messages.push(
      createMessage(
        'loans',
        'error',
        'Detailed estimates require at least one loan.'
      )
    );
  }

  if (scenario.aggregate) {
    if (!isNonNegative(scenario.aggregate.balanceCents)) {
      messages.push(
        createMessage(
          'aggregate.balanceCents',
          'error',
          'Loan balance cannot be negative.'
        )
      );
    }

    if (
      !isPercentInRange(scenario.aggregate.weightedAverageInterestRate, 0, 20)
    ) {
      messages.push(
        createMessage(
          'aggregate.weightedAverageInterestRate',
          'error',
          'Weighted average interest rate must be between 0% and 20%.'
        )
      );
    }
  }

  scenario.loans.forEach((loan, index) => {
    const prefix = `loans.${index}`;

    if (!loan.id.trim()) {
      messages.push(
        createMessage(`${prefix}.id`, 'error', 'Each loan must have an id.')
      );
    }

    if (!isNonNegative(loan.balanceCents)) {
      messages.push(
        createMessage(
          `${prefix}.balanceCents`,
          'error',
          'Loan balance cannot be negative.'
        )
      );
    }

    if (!isPercentInRange(loan.interestRate, 0, 20)) {
      messages.push(
        createMessage(
          `${prefix}.interestRate`,
          'error',
          'Loan interest rate must be between 0% and 20%.'
        )
      );
    }

    if (!isIsoDate(loan.disbursementDate)) {
      messages.push(
        createMessage(
          `${prefix}.disbursementDate`,
          'error',
          'Disbursement date must use YYYY-MM-DD format.'
        )
      );
    }

    if (!isIsoDate(loan.enteredRepaymentDate)) {
      messages.push(
        createMessage(
          `${prefix}.enteredRepaymentDate`,
          'error',
          'Repayment start date must use YYYY-MM-DD format.'
        )
      );
    }
  });

  if (!isIntegerInRange(scenario.household.familySize, 1, 20)) {
    messages.push(
      createMessage(
        'household.familySize',
        'error',
        'Family size must be between 1 and 20.'
      )
    );
  }

  if (!isIntegerInRange(scenario.household.rapDependents, 0, 20)) {
    messages.push(
      createMessage(
        'household.rapDependents',
        'error',
        'RAP dependents must be between 0 and 20.'
      )
    );
  }

  if (!isNonNegative(scenario.household.spouseIncomeCents)) {
    messages.push(
      createMessage(
        'household.spouseIncomeCents',
        'error',
        'Spouse income cannot be negative.'
      )
    );
  }

  if (!isNonNegative(scenario.household.spouseFederalDebtCents)) {
    messages.push(
      createMessage(
        'household.spouseFederalDebtCents',
        'error',
        'Spouse federal debt cannot be negative.'
      )
    );
  }

  if (!isNonNegative(scenario.income.agiCents)) {
    messages.push(
      createMessage('income.agiCents', 'error', 'AGI cannot be negative.')
    );
  }

  if (!isPercentInRange(scenario.income.annualIncomeGrowthRate, 0, 20)) {
    messages.push(
      createMessage(
        'income.annualIncomeGrowthRate',
        'error',
        'Annual income growth must be between 0% and 20%.'
      )
    );
  }

  if (!isIntegerInRange(scenario.repaymentHistory.idrMonths, 0, 360)) {
    messages.push(
      createMessage(
        'repaymentHistory.idrMonths',
        'error',
        'Existing IDR credit must be 0–360 months.'
      )
    );
  }

  if (
    !isIntegerInRange(scenario.repaymentHistory.pslfQualifyingMonths, 0, 120)
  ) {
    messages.push(
      createMessage(
        'repaymentHistory.pslfQualifyingMonths',
        'error',
        'Existing PSLF credit must be 0–120 months.'
      )
    );
  }

  if (!isIntegerInRange(scenario.pslf.qualifyingMonths, 0, 120)) {
    messages.push(
      createMessage(
        'pslf.qualifyingMonths',
        'error',
        'PSLF qualifying months must be 0–120.'
      )
    );
  }

  if (!isPercentInRange(scenario.tax.estimatedFederalRate, 0, 50)) {
    messages.push(
      createMessage(
        'tax.estimatedFederalRate',
        'error',
        'Federal forgiveness tax rate must be 0%–50%.'
      )
    );
  }

  if (!isPercentInRange(scenario.tax.estimatedStateRate, 0, 20)) {
    messages.push(
      createMessage(
        'tax.estimatedStateRate',
        'error',
        'State forgiveness tax rate must be 0%–20%.'
      )
    );
  }

  if (!isIsoDate(scenario.assumptions.projectionStartDate)) {
    messages.push(
      createMessage(
        'assumptions.projectionStartDate',
        'error',
        'Projection start date must use YYYY-MM-DD format.'
      )
    );
  }

  if (!scenario.assumptions.rulesVersion.trim()) {
    messages.push(
      createMessage(
        'assumptions.rulesVersion',
        'error',
        'Rules version is required.'
      )
    );
  }

  return {
    isValid: !messages.some((message) => message.severity === 'error'),
    messages
  };
};

export const calculateEstimateQuality = (
  scenario: BorrowerScenario
): EstimateQuality => {
  if (
    scenario.mode === 'detailed' &&
    scenario.loans.length > 0 &&
    scenario.unknownFields.length === 0
  ) {
    return 'detailed';
  }

  const knownHistory =
    scenario.repaymentHistory.idrMonths > 0 ||
    scenario.repaymentHistory.pslfQualifyingMonths > 0 ||
    scenario.pslf.publicServiceStatus !== 'unsure';

  if (
    scenario.unknownFields.length <= 2 &&
    (scenario.loans.length > 0 || knownHistory)
  ) {
    return 'improved';
  }

  return 'basic';
};

export const hasFieldError = (
  validation: ValidationState,
  field: ScenarioFieldPath
) =>
  validation.messages.some(
    (message) => message.field === field && message.severity === 'error'
  );
