import { describe, expect, it } from 'vitest';
import {
  cents,
  fieldPath,
  percentage,
  type BorrowerScenario
} from '$lib/domain';
import {
  detailedParentPlusScenario,
  quickDirectBorrowerScenario
} from '$lib/domain/fixtures/scenarios';
import {
  evaluatePlanEligibility,
  evaluateScenarioEligibility,
  scenarioPlanOrder
} from '$lib/domain/eligibility';

const findPlan = (
  scenario: BorrowerScenario,
  planId: (typeof scenarioPlanOrder)[number]
) =>
  evaluateScenarioEligibility(scenario).find(
    (result) => result.planId === planId
  );

describe('eligibility engine', () => {
  it('evaluates every required plan id in deterministic display order', () => {
    const results = evaluateScenarioEligibility(quickDirectBorrowerScenario);

    expect(results.map((result) => result.planId)).toEqual(scenarioPlanOrder);
    expect(results).toHaveLength(14);
  });

  it('marks a pre-July-2026 Direct borrower as eligible for baseline direct and fixed plans', () => {
    expect(findPlan(quickDirectBorrowerScenario, 'rap')).toMatchObject({
      status: 'eligible'
    });
    expect(findPlan(quickDirectBorrowerScenario, 'standard')).toMatchObject({
      status: 'eligible'
    });
    expect(findPlan(quickDirectBorrowerScenario, 'ibr_10')).toMatchObject({
      status: 'eligible'
    });
  });

  it('keeps PAYE potential and SAVE unavailable under active metadata', () => {
    expect(findPlan(quickDirectBorrowerScenario, 'paye')).toMatchObject({
      status: 'potentially_eligible'
    });
    expect(
      findPlan(quickDirectBorrowerScenario, 'save_unavailable')
    ).toMatchObject({
      status: 'unavailable'
    });
  });

  it('treats Parent PLUS RAP and ICR as transition-route review cases', () => {
    expect(findPlan(detailedParentPlusScenario, 'rap')).toMatchObject({
      status: 'potentially_eligible'
    });
    expect(findPlan(detailedParentPlusScenario, 'icr')).toMatchObject({
      status: 'potentially_eligible'
    });
  });

  it('marks FFEL-only borrowers eligible for FFEL income-sensitive and not RAP', () => {
    const ffelScenario: BorrowerScenario = {
      ...quickDirectBorrowerScenario,
      aggregate: {
        ...quickDirectBorrowerScenario.aggregate!,
        loanProgram: 'ffel',
        loanType: 'ffel_unsubsidized'
      }
    };

    expect(findPlan(ffelScenario, 'ffel_income_sensitive')).toMatchObject({
      status: 'eligible'
    });
    expect(findPlan(ffelScenario, 'rap')).toMatchObject({
      status: 'ineligible'
    });
  });

  it('marks Perkins-only borrowers eligible for Perkins repayment and ineligible for FFEL income-sensitive', () => {
    const perkinsScenario: BorrowerScenario = {
      ...quickDirectBorrowerScenario,
      aggregate: {
        ...quickDirectBorrowerScenario.aggregate!,
        loanProgram: 'perkins',
        loanType: 'perkins'
      }
    };

    expect(findPlan(perkinsScenario, 'perkins_standard')).toMatchObject({
      status: 'eligible'
    });
    expect(findPlan(perkinsScenario, 'ffel_income_sensitive')).toMatchObject({
      status: 'ineligible'
    });
  });

  it('downgrades defaulted loan scenarios to potential review instead of clear eligibility', () => {
    const defaultScenario: BorrowerScenario = {
      ...detailedParentPlusScenario,
      loans: detailedParentPlusScenario.loans.map((loan) => ({
        ...loan,
        isInDefault: true
      }))
    };

    expect(evaluatePlanEligibility(defaultScenario, 'standard')).toMatchObject({
      status: 'potentially_eligible'
    });
  });

  it('returns missing-field context for unknown disbursement cohort', () => {
    const unknownCohortScenario: BorrowerScenario = {
      ...quickDirectBorrowerScenario,
      aggregate: {
        ...quickDirectBorrowerScenario.aggregate!,
        disbursementCohort: 'unknown'
      },
      unknownFields: [fieldPath('aggregate.disbursementCohort')]
    };

    const result = evaluatePlanEligibility(unknownCohortScenario, 'rap');

    expect(result.status).toBe('potentially_eligible');
    expect(result.missingFields).toContain(
      fieldPath('aggregate.disbursementCohort')
    );
  });

  it('uses balance threshold metadata for extended plans', () => {
    const lowBalanceScenario: BorrowerScenario = {
      ...quickDirectBorrowerScenario,
      aggregate: {
        ...quickDirectBorrowerScenario.aggregate!,
        balanceCents: cents(12_000_00),
        weightedAverageInterestRate: percentage(5)
      }
    };

    expect(
      evaluatePlanEligibility(lowBalanceScenario, 'extended_fixed')
    ).toMatchObject({
      status: 'ineligible'
    });
    expect(
      evaluatePlanEligibility(quickDirectBorrowerScenario, 'extended_fixed')
    ).toMatchObject({
      status: 'eligible'
    });
  });
});
