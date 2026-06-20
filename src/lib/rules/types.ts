import type { SourceId } from '$lib/domain';

export type SourceType =
  | 'statute'
  | 'regulation'
  | 'federal-register'
  | 'agency-guidance'
  | 'annual-data'
  | 'technical-doc';

export interface SourceRecord {
  readonly id: SourceId;
  readonly title: string;
  readonly publisher: string;
  readonly url: string;
  readonly retrievedOn: string;
  readonly publishedOn?: string;
  readonly effectiveFrom?: string;
  readonly sourceType: SourceType;
  readonly notes?: string;
}

export interface RuleSetMetadata {
  readonly id: string;
  readonly effectiveFrom: string;
  readonly effectiveThrough: string | null;
  readonly reviewedOn: string;
  readonly status: 'active' | 'historical' | 'future';
  readonly sourceIds: readonly SourceId[];
  readonly notes: readonly string[];
}
