import { describe, expect, it } from 'vitest';
import {
  PLAN_IDS,
  detailedParentPlusScenario,
  fixtureScenarios,
  quickDirectBorrowerScenario,
  type BorrowerScenario,
  type PlanId
} from '$lib/domain';

const assertScenarioShape = (scenario: BorrowerScenario) => {
  expect(scenario.schemaVersion).toBe(1);
  expect(scenario.asOfDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(scenario.household.familySize).toBeGreaterThan(0);
  expect(scenario.income.agiCents).toBeGreaterThanOrEqual(0);
  expect(scenario.assumptions.rulesVersion).toBeTruthy();
};

describe('domain types and deterministic fixtures', () => {
  it('exports all required plan ids from the PRD appendix', () => {
    const requiredPlanIds: readonly PlanId[] = [
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

    expect(PLAN_IDS).toEqual(requiredPlanIds);
  });

  it('provides a quick Direct borrower fixture with aggregate loan inputs', () => {
    assertScenarioShape(quickDirectBorrowerScenario);
    expect(quickDirectBorrowerScenario.mode).toBe('quick');
    expect(quickDirectBorrowerScenario.aggregate?.loanProgram).toBe('direct');
    expect(quickDirectBorrowerScenario.loans).toHaveLength(0);
  });

  it('provides a detailed Parent PLUS fixture with loan-level inputs', () => {
    assertScenarioShape(detailedParentPlusScenario);
    expect(detailedParentPlusScenario.mode).toBe('detailed');
    expect(detailedParentPlusScenario.loans).toHaveLength(1);
    expect(detailedParentPlusScenario.repaymentHistory.parentPlusHistory).toBe(
      'has_parent_plus'
    );
  });

  it('keeps fixture dates and ordering deterministic', () => {
    expect(fixtureScenarios.map((scenario) => scenario.asOfDate)).toEqual([
      '2026-07-01',
      '2026-07-01'
    ]);
    expect(fixtureScenarios.map((scenario) => scenario.mode)).toEqual([
      'quick',
      'detailed'
    ]);
  });
});
