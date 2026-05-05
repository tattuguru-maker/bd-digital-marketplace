"use client";

import type {
  RuleCondition,
  RuleGroup,
  CriteriaSet,
  CohortSubject,
  CohortRun,
  InputSnapshotMeta,
  DataSource,
  DataDictionaryEntry,
} from "./types";

function coerceValue(val: unknown): string | number {
  if (val === null || val === undefined) return "";
  const str = String(val);
  const num = Number(str);
  if (!isNaN(num) && str.trim() !== "") return num;
  return str;
}

function evaluateCondition(
  row: Record<string, unknown>,
  condition: RuleCondition
): boolean {
  const rawVal = row[condition.field];
  const val = coerceValue(rawVal);
  const target = condition.value;
  const targetTo = condition.valueTo;

  switch (condition.operator) {
    case "equals":
      return String(val).toLowerCase() === String(target).toLowerCase();
    case "not_equals":
      return String(val).toLowerCase() !== String(target).toLowerCase();
    case "greater_than":
      return Number(val) > Number(target);
    case "less_than":
      return Number(val) < Number(target);
    case "greater_equal":
      return Number(val) >= Number(target);
    case "less_equal":
      return Number(val) <= Number(target);
    case "between":
      return Number(val) >= Number(target) && Number(val) <= Number(targetTo ?? target);
    case "contains":
      return String(val).toLowerCase().includes(String(target).toLowerCase());
    case "not_contains":
      return !String(val).toLowerCase().includes(String(target).toLowerCase());
    case "starts_with":
      return String(val).toLowerCase().startsWith(String(target).toLowerCase());
    case "ends_with":
      return String(val).toLowerCase().endsWith(String(target).toLowerCase());
    case "is_empty":
      return val === "" || val === null || val === undefined;
    case "is_not_empty":
      return val !== "" && val !== null && val !== undefined;
    case "in_list": {
      const list = String(target).split(",").map((s) => s.trim().toLowerCase());
      return list.includes(String(val).toLowerCase());
    }
    default:
      return false;
  }
}

function evaluateGroup(
  row: Record<string, unknown>,
  group: RuleGroup
): boolean {
  const conditionResults = group.conditions.map((c) => evaluateCondition(row, c));
  const groupResults = group.groups.map((g) => evaluateGroup(row, g));
  const allResults = [...conditionResults, ...groupResults];

  if (allResults.length === 0) return true;

  if (group.logic === "AND") {
    return allResults.every(Boolean);
  }
  return allResults.some(Boolean);
}

function detectContactField(
  row: Record<string, unknown>
): { detail: string; type: CohortSubject["contactType"] } {
  const keys = Object.keys(row);
  const emailKey = keys.find((k) =>
    k.toLowerCase().includes("email")
  );
  if (emailKey && row[emailKey]) {
    return { detail: String(row[emailKey]), type: "email" };
  }

  const phoneKey = keys.find((k) =>
    k.toLowerCase().includes("phone") || k.toLowerCase().includes("mobile") || k.toLowerCase().includes("tel")
  );
  if (phoneKey && row[phoneKey]) {
    return { detail: String(row[phoneKey]), type: "phone" };
  }

  const addrKey = keys.find((k) =>
    k.toLowerCase().includes("address")
  );
  if (addrKey && row[addrKey]) {
    return { detail: String(row[addrKey]), type: "address" };
  }

  const firstNonEmpty = keys.find((k) => row[k] && String(row[k]).length > 0);
  return {
    detail: firstNonEmpty ? String(row[firstNonEmpty]) : "N/A",
    type: "other",
  };
}

function detectNameField(row: Record<string, unknown>): string {
  const keys = Object.keys(row);
  const nameKey = keys.find((k) =>
    k.toLowerCase() === "name" || k.toLowerCase() === "full_name" || k.toLowerCase() === "fullname"
  );
  if (nameKey && row[nameKey]) return String(row[nameKey]);

  const firstKey = keys.find((k) => k.toLowerCase().includes("first"));
  const lastKey = keys.find((k) => k.toLowerCase().includes("last") || k.toLowerCase().includes("surname"));
  if (firstKey && lastKey) {
    return `${row[firstKey] ?? ""} ${row[lastKey] ?? ""}`.trim();
  }
  if (firstKey) return String(row[firstKey] ?? "");

  return keys[0] ? String(row[keys[0]] ?? "Unknown") : "Unknown";
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

export function generateRunId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return `RUN-${date}-${seq}`;
}

export function buildMatrix(sources: DataSource[]): Record<string, unknown>[] {
  const matrix: Record<string, unknown>[] = [];

  for (const source of sources) {
    for (const row of source.rawData) {
      const mappedRow: Record<string, unknown> = { __sourceId: source.id, __sourceName: source.name };

      if (source.mappings.length > 0) {
        for (const mapping of source.mappings) {
          let val = row[mapping.sourceColumn];
          switch (mapping.transform) {
            case "uppercase":
              val = String(val ?? "").toUpperCase();
              break;
            case "lowercase":
              val = String(val ?? "").toLowerCase();
              break;
            case "trim":
              val = String(val ?? "").trim();
              break;
            case "toNumber":
              val = Number(val);
              break;
            case "toDate":
              val = new Date(String(val)).toISOString();
              break;
          }
          mappedRow[mapping.targetField] = val;
        }
      } else {
        Object.entries(row).forEach(([k, v]) => {
          mappedRow[k] = v;
        });
      }

      matrix.push(mappedRow);
    }
  }

  return matrix;
}

export function executeCriteria(
  matrix: Record<string, unknown>[],
  criteria: CriteriaSet,
  sources: DataSource[]
): CohortRun {
  const runId = generateRunId();
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  try {
    const matched = matrix.filter((row) => evaluateGroup(row, criteria.rootGroup));

    const subjects: CohortSubject[] = matched.map((row, idx) => {
      const contact = detectContactField(row);
      const name = detectNameField(row);

      const matchedFields: Record<string, unknown> = {};
      Object.entries(row).forEach(([k, v]) => {
        if (!k.startsWith("__")) matchedFields[k] = v;
      });

      return {
        id: `SUB-${idx.toString().padStart(5, "0")}`,
        name,
        contactDetail: contact.detail,
        contactType: contact.type,
        matchedFields,
      };
    });

    const snapshot: InputSnapshotMeta = {
      sourceIds: sources.map((s) => s.id),
      sourceNames: sources.map((s) => s.name),
      totalRows: matrix.length,
      snapshotHash: hashString(JSON.stringify(matrix.slice(0, 100))),
    };

    return {
      id,
      runId,
      criteriaSetId: criteria.id,
      criteriaVersion: criteria.version,
      criteriaName: criteria.name,
      timestamp,
      inputSnapshot: snapshot,
      resultCount: subjects.length,
      subjects,
      status: "completed",
    };
  } catch (err) {
    return {
      id,
      runId,
      criteriaSetId: criteria.id,
      criteriaVersion: criteria.version,
      criteriaName: criteria.name,
      timestamp,
      inputSnapshot: {
        sourceIds: sources.map((s) => s.id),
        sourceNames: sources.map((s) => s.name),
        totalRows: matrix.length,
        snapshotHash: "",
      },
      resultCount: 0,
      subjects: [],
      status: "failed",
      errorMessage: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export function buildDataDictionary(sources: DataSource[]): DataDictionaryEntry[] {
  const entries: DataDictionaryEntry[] = [];

  for (const source of sources) {
    for (const col of source.columns) {
      const sampleValues = source.rawData
        .slice(0, 5)
        .map((r) => String(r[col.name] ?? ""))
        .filter((v) => v !== "");

      entries.push({
        field: col.name,
        type: col.type,
        source: source.name,
        description: col.description || `Column from ${source.name}`,
        sampleValues,
      });
    }
  }

  return entries;
}
