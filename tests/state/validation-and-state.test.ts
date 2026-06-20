import { describe, expect, it } from 'vitest';
import { cents, fieldPath } from '$lib/domain';
import {
  detailedParentPlusScenario,
  quickDirectBorrowerScenario
} from '$lib/domain/fixtures/scenarios';
import {
  SESSION_STORAGE_KEY,
  createEstimatorStore,
  createInitialEstimatorState,
  deleteSessionDraft,
  hasFieldError,
  loadSessionDraft,
  saveSessionDraft,
  validateScenario,
  type StorageLike
} from '$lib/state';

class MemoryStorage implements StorageLike {
  readonly #data = new Map<string, string>();

  get length() {
    return this.#data.size;
  }

  clear() {
    this.#data.clear();
  }

  getItem(key: string) {
    return this.#data.get(key) ?? null;
  }

  key(index: number) {
    return [...this.#data.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.#data.delete(key);
  }

  setItem(key: string, value: string) {
    this.#data.set(key, value);
  }
}

describe('scenario validation', () => {
  it('accepts deterministic fixtures', () => {
    expect(validateScenario(quickDirectBorrowerScenario)).toMatchObject({
      isValid: true
    });
    expect(validateScenario(detailedParentPlusScenario)).toMatchObject({
      isValid: true
    });
  });

  it('reports field-level errors for invalid borrower input', () => {
    const invalidScenario = {
      ...quickDirectBorrowerScenario,
      household: {
        ...quickDirectBorrowerScenario.household,
        familySize: 0
      },
      income: {
        ...quickDirectBorrowerScenario.income,
        agiCents: cents(-1)
      }
    };

    const validation = validateScenario(invalidScenario);

    expect(validation.isValid).toBe(false);
    expect(hasFieldError(validation, fieldPath('household.familySize'))).toBe(
      true
    );
    expect(hasFieldError(validation, fieldPath('income.agiCents'))).toBe(true);
  });
});

describe('estimator store', () => {
  it('creates serializable initial state with derived validation and quality', () => {
    const state = createInitialEstimatorState(quickDirectBorrowerScenario);

    expect(state).toMatchObject({
      schemaVersion: 1,
      mode: 'quick',
      stage: 'landing',
      calculationStatus: 'idle',
      undoAvailable: false,
      estimateQuality: 'improved'
    });
    expect(state.validation.isValid).toBe(true);
  });

  it('updates scenario state and supports one-step undo', () => {
    const store = createEstimatorStore(quickDirectBorrowerScenario);

    store.updateScenario((scenario) => ({
      ...scenario,
      income: {
        ...scenario.income,
        agiCents: cents(72_000_00)
      }
    }));

    expect(store.snapshot().scenario.income.agiCents).toBe(cents(72_000_00));
    expect(store.snapshot().undoAvailable).toBe(true);

    expect(store.undo()).toBe(true);
    expect(store.snapshot().scenario.income.agiCents).toBe(
      quickDirectBorrowerScenario.income.agiCents
    );
    expect(store.snapshot().undoAvailable).toBe(false);
  });
});

describe('session draft storage', () => {
  it('saves, loads, and deletes a valid session draft', () => {
    const storage = new MemoryStorage();
    const state = {
      ...createInitialEstimatorState(detailedParentPlusScenario, 'results'),
      expandedAllPlans: true
    };

    const saved = saveSessionDraft(storage, state, '2026-06-20T00:00:00.000Z');
    const loaded = loadSessionDraft(storage);

    expect(saved.savedAt).toBe('2026-06-20T00:00:00.000Z');
    expect(storage.getItem(SESSION_STORAGE_KEY)).not.toBeNull();
    expect(loaded).toMatchObject({ ok: true });

    deleteSessionDraft(storage);
    expect(loadSessionDraft(storage)).toEqual({ ok: false, reason: 'missing' });
  });

  it('rejects malformed or invalid session drafts without throwing', () => {
    const storage = new MemoryStorage();

    storage.setItem(SESSION_STORAGE_KEY, '{bad-json');
    expect(loadSessionDraft(storage)).toEqual({
      ok: false,
      reason: 'invalid-json'
    });

    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ schemaVersion: 99 }));
    expect(loadSessionDraft(storage)).toEqual({
      ok: false,
      reason: 'invalid-schema'
    });

    storage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        savedAt: '2026-06-20T00:00:00.000Z',
        expandedAllPlans: false,
        scenario: {
          ...quickDirectBorrowerScenario,
          household: { ...quickDirectBorrowerScenario.household, familySize: 0 }
        }
      })
    );
    expect(loadSessionDraft(storage)).toEqual({
      ok: false,
      reason: 'invalid-scenario'
    });
  });
});
