import type { BorrowerScenario, EstimatorState } from '$lib/domain';
import { validateScenario } from '$lib/state/validation';

export const SESSION_STORAGE_KEY = 'student-loan-planner:estimator-draft:v1';

export interface StorageLike {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface SessionDraft {
  readonly schemaVersion: 1;
  readonly savedAt: string;
  readonly scenario: BorrowerScenario;
  readonly expandedAllPlans: boolean;
}

export type SessionDraftLoadResult =
  | { readonly ok: true; readonly draft: SessionDraft }
  | {
      readonly ok: false;
      readonly reason:
        | 'missing'
        | 'invalid-json'
        | 'invalid-schema'
        | 'invalid-scenario';
    };

export const createSessionDraft = (
  state: EstimatorState,
  savedAt = new Date().toISOString()
) => ({
  schemaVersion: 1 as const,
  savedAt,
  scenario: state.scenario,
  expandedAllPlans: state.expandedAllPlans
});

export const saveSessionDraft = (
  storage: StorageLike,
  state: EstimatorState,
  savedAt?: string
): SessionDraft => {
  const draft = createSessionDraft(state, savedAt);
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(draft));
  return draft;
};

export const loadSessionDraft = (
  storage: StorageLike
): SessionDraftLoadResult => {
  const raw = storage.getItem(SESSION_STORAGE_KEY);

  if (!raw) {
    return { ok: false, reason: 'missing' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'invalid-json' };
  }

  if (!isSessionDraft(parsed)) {
    return { ok: false, reason: 'invalid-schema' };
  }

  if (!validateScenario(parsed.scenario).isValid) {
    return { ok: false, reason: 'invalid-scenario' };
  }

  return { ok: true, draft: parsed };
};

export const deleteSessionDraft = (storage: StorageLike) => {
  storage.removeItem(SESSION_STORAGE_KEY);
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isSessionDraft = (value: unknown): value is SessionDraft => {
  if (!isObject(value)) {
    return false;
  }

  return (
    value.schemaVersion === 1 &&
    typeof value.savedAt === 'string' &&
    typeof value.expandedAllPlans === 'boolean' &&
    isObject(value.scenario) &&
    value.scenario.schemaVersion === 1
  );
};
