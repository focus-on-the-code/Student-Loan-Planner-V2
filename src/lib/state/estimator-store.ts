import { get, writable } from 'svelte/store';
import type {
  BorrowerScenario,
  EstimatorStage,
  EstimatorState
} from '$lib/domain';
import {
  calculateEstimateQuality,
  validateScenario
} from '$lib/state/validation';

const buildState = (
  scenario: BorrowerScenario,
  stage: EstimatorStage,
  undoAvailable: boolean,
  expandedAllPlans = false
): EstimatorState => ({
  schemaVersion: 1,
  mode: scenario.mode,
  stage,
  scenario,
  validation: validateScenario(scenario),
  results: null,
  calculationStatus: 'idle',
  expandedAllPlans,
  selectedChartPlanIds: [],
  estimateQuality: calculateEstimateQuality(scenario),
  undoAvailable
});

export const createInitialEstimatorState = (
  scenario: BorrowerScenario,
  stage: EstimatorStage = 'landing'
): EstimatorState => buildState(scenario, stage, false);

export const createEstimatorStore = (initialScenario: BorrowerScenario) => {
  const history: BorrowerScenario[] = [];
  const store = writable<EstimatorState>(
    createInitialEstimatorState(initialScenario)
  );

  const setScenario = (scenario: BorrowerScenario, pushHistory = true) => {
    const current = get(store);

    if (pushHistory) {
      history.push(current.scenario);
      if (history.length > 20) {
        history.shift();
      }
    }

    store.set(
      buildState(
        scenario,
        current.stage,
        history.length > 0,
        current.expandedAllPlans
      )
    );
  };

  return {
    subscribe: store.subscribe,
    setScenario,
    updateScenario(updater: (scenario: BorrowerScenario) => BorrowerScenario) {
      setScenario(updater(get(store).scenario));
    },
    setStage(stage: EstimatorStage) {
      const current = get(store);
      store.set(
        buildState(
          current.scenario,
          stage,
          history.length > 0,
          current.expandedAllPlans
        )
      );
    },
    setExpandedAllPlans(expandedAllPlans: boolean) {
      const current = get(store);
      store.set(
        buildState(
          current.scenario,
          current.stage,
          history.length > 0,
          expandedAllPlans
        )
      );
    },
    undo() {
      const previous = history.pop();
      if (!previous) {
        return false;
      }

      const current = get(store);
      store.set(
        buildState(
          previous,
          current.stage,
          history.length > 0,
          current.expandedAllPlans
        )
      );
      return true;
    },
    reset(scenario: BorrowerScenario = initialScenario) {
      history.length = 0;
      store.set(createInitialEstimatorState(scenario));
    },
    snapshot() {
      return get(store);
    }
  };
};

export type EstimatorStore = ReturnType<typeof createEstimatorStore>;
