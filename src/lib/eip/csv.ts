"use client";

import type { ColumnSchema } from "./types";

export function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

export function inferColumnType(values: string[]): ColumnSchema["type"] {
  const sample = values.filter((v) => v !== "").slice(0, 50);
  if (sample.length === 0) return "string";

  const allBool = sample.every((v) => ["true", "false", "yes", "no", "1", "0"].includes(v.toLowerCase()));
  if (allBool) return "boolean";

  const allNum = sample.every((v) => !isNaN(Number(v)) && v.trim() !== "");
  if (allNum) return "number";

  const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{2}[/-]\d{2}[/-]\d{4}/;
  const allDate = sample.every((v) => datePattern.test(v));
  if (allDate) return "date";

  return "string";
}

export function autoDetectColumns(
  headers: string[],
  rows: Record<string, string>[],
  sourceName: string
): ColumnSchema[] {
  return headers.map((h) => ({
    name: h,
    type: inferColumnType(rows.map((r) => r[h] ?? "")),
    sourceName,
    description: "",
  }));
}

export function generateCSVExport(
  headers: string[],
  rows: Record<string, unknown>[]
): string {
  const escape = (val: unknown): string => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}
