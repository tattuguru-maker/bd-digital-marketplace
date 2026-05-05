// ── Core types for the EIP Cohort Identification System ──

export interface ColumnSchema {
  name: string;
  type: "string" | "number" | "date" | "boolean";
  sourceName: string;
  description?: string;
}

export interface SchemaMapping {
  sourceColumn: string;
  targetField: string;
  transform?: "none" | "uppercase" | "lowercase" | "trim" | "toNumber" | "toDate";
}

export interface DataSource {
  id: string;
  name: string;
  description: string;
  fileName: string;
  uploadedAt: string;
  rowCount: number;
  columns: ColumnSchema[];
  mappings: SchemaMapping[];
  rawData: Record<string, unknown>[];
}

export type Operator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "greater_equal"
  | "less_equal"
  | "between"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "is_empty"
  | "is_not_empty"
  | "in_list";

export interface RuleCondition {
  id: string;
  field: string;
  operator: Operator;
  value: string | number;
  valueTo?: string | number; // for 'between'
}

export type LogicOperator = "AND" | "OR";

export interface RuleGroup {
  id: string;
  logic: LogicOperator;
  conditions: RuleCondition[];
  groups: RuleGroup[];
}

export interface CriteriaSet {
  id: string;
  name: string;
  version: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  rootGroup: RuleGroup;
}

export interface CohortSubject {
  id: string;
  name: string;
  contactDetail: string;
  contactType: "email" | "phone" | "address" | "other";
  matchedFields: Record<string, unknown>;
  riskScore?: number;
}

export interface InputSnapshotMeta {
  sourceIds: string[];
  sourceNames: string[];
  totalRows: number;
  snapshotHash: string;
}

export interface CohortRun {
  id: string;
  runId: string; // unique run ID (e.g. RUN-20250505-001)
  criteriaSetId: string;
  criteriaVersion: number;
  criteriaName: string;
  timestamp: string;
  inputSnapshot: InputSnapshotMeta;
  resultCount: number;
  subjects: CohortSubject[];
  status: "completed" | "failed" | "running";
  errorMessage?: string;
}

export interface DataDictionaryEntry {
  field: string;
  type: string;
  source: string;
  description: string;
  sampleValues: string[];
}

export interface EipState {
  dataSources: DataSource[];
  criteriaSets: CriteriaSet[];
  runs: CohortRun[];
}
