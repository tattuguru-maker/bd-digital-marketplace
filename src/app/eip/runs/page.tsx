"use client";

import { useState, useMemo } from "react";
import { useEip } from "@/lib/eip/context";
import { buildMatrix, executeCriteria, buildDataDictionary } from "@/lib/eip/engine";
import { generateCSVExport } from "@/lib/eip/csv";
import type { CohortRun, DataDictionaryEntry } from "@/lib/eip/types";
import {
  Play,
  Download,
  Eye,
  X,
  Clock,
  Users,
  Hash,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  BookOpen,
} from "lucide-react";

const PAGE_SIZE = 20;

export default function RunsPage() {
  const { state, addRun, isLoaded } = useEip();
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [viewRun, setViewRun] = useState<CohortRun | null>(null);
  const [page, setPage] = useState(0);
  const [showDict, setShowDict] = useState(false);

  const sortedRuns = useMemo(
    () =>
      [...state.runs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [state.runs]
  );

  const handleRun = () => {
    const criteria = state.criteriaSets.find((c) => c.id === selectedCriteriaId);
    if (!criteria) {
      alert("Please select a criteria set");
      return;
    }
    if (state.dataSources.length === 0) {
      alert("No data sources available. Upload data sources first.");
      return;
    }

    setRunning(true);

    setTimeout(() => {
      const matrix = buildMatrix(state.dataSources);
      const run = executeCriteria(matrix, criteria, state.dataSources);
      addRun(run);
      setRunning(false);
      setViewRun(run);
    }, 500);
  };

  const exportRun = (run: CohortRun) => {
    const headers = ["id", "name", "contactDetail", "contactType", "riskScore"];
    const fieldHeaders: string[] = [];

    if (run.subjects.length > 0) {
      Object.keys(run.subjects[0].matchedFields).forEach((k) => {
        if (!headers.includes(k)) {
          fieldHeaders.push(k);
        }
      });
    }

    const allHeaders = [...headers, ...fieldHeaders];
    const rows = run.subjects.map((s) => ({
      ...s,
      ...s.matchedFields,
    }));

    const csv = generateCSVExport(allHeaders, rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cohort-${run.runId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDataDictionary = (entries: DataDictionaryEntry[]) => {
    const headers = ["field", "type", "source", "description", "sampleValues"];
    const rows = entries.map((e) => ({
      ...e,
      sampleValues: e.sampleValues.join("; "),
    }));
    const csv = generateCSVExport(headers, rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-dictionary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const dataDictionary = useMemo(
    () => buildDataDictionary(state.dataSources),
    [state.dataSources]
  );

  if (!isLoaded) {
    return <div className="animate-pulse text-fg-subtle p-8">Loading...</div>;
  }

  if (showDict) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-fg">Data Dictionary</h1>
            <p className="mt-1 text-sm text-fg-muted">
              Compact reference of all fields across data sources
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportDataDictionary(dataDictionary)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-fg text-sm hover:bg-surface-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowDict(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-fg text-sm hover:bg-surface-2 transition-colors"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elev">
                <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Field</th>
                <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Type</th>
                <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Source</th>
                <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Description</th>
                <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Sample Values</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {dataDictionary.map((entry, idx) => (
                <tr key={idx} className="hover:bg-bg-elev/50">
                  <td className="p-3 font-mono text-xs text-fg">{entry.field}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.type === "number"
                        ? "bg-cyan-400/10 text-cyan-400"
                        : entry.type === "date"
                          ? "bg-gold-400/10 text-gold-400"
                          : entry.type === "boolean"
                            ? "bg-success/10 text-success"
                            : "bg-iris-400/10 text-iris-400"
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-fg-muted">{entry.source}</td>
                  <td className="p-3 text-xs text-fg-muted">{entry.description}</td>
                  <td className="p-3 text-xs text-fg-subtle font-mono">{entry.sampleValues.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (viewRun) {
    const pageCount = Math.ceil(viewRun.subjects.length / PAGE_SIZE);
    const pageSubjects = viewRun.subjects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-fg">
              Run: {viewRun.runId}
            </h1>
            <p className="mt-1 text-sm text-fg-muted">
              {viewRun.criteriaName} v{viewRun.criteriaVersion} &middot;{" "}
              {new Date(viewRun.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportRun(viewRun)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowDict(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-fg text-sm hover:bg-surface-2 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Data Dictionary
            </button>
            <button
              onClick={() => {
                setViewRun(null);
                setPage(0);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-fg text-sm hover:bg-surface-2 transition-colors"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="surface-card p-4">
            <p className="text-xs text-fg-subtle uppercase tracking-wider">Status</p>
            <p className={`mt-1 text-lg font-bold ${viewRun.status === "completed" ? "text-success" : "text-danger"}`}>
              {viewRun.status === "completed" ? "Completed" : "Failed"}
            </p>
          </div>
          <div className="surface-card p-4">
            <p className="text-xs text-fg-subtle uppercase tracking-wider">Subjects Found</p>
            <p className="mt-1 text-lg font-bold text-fg">{viewRun.resultCount.toLocaleString()}</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-xs text-fg-subtle uppercase tracking-wider">Input Rows</p>
            <p className="mt-1 text-lg font-bold text-fg">{viewRun.inputSnapshot.totalRows.toLocaleString()}</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-xs text-fg-subtle uppercase tracking-wider">Snapshot Hash</p>
            <p className="mt-1 text-lg font-bold text-fg font-mono text-sm">{viewRun.inputSnapshot.snapshotHash}</p>
          </div>
        </div>

        <div className="surface-card p-4">
          <h3 className="text-xs text-fg-subtle uppercase tracking-wider mb-2">Run Metadata</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-fg-subtle">Run ID:</span>{" "}
              <span className="font-mono text-fg">{viewRun.runId}</span>
            </div>
            <div>
              <span className="text-fg-subtle">Criteria:</span>{" "}
              <span className="text-fg">{viewRun.criteriaName}</span>
            </div>
            <div>
              <span className="text-fg-subtle">Version:</span>{" "}
              <span className="text-fg">{viewRun.criteriaVersion}</span>
            </div>
            <div>
              <span className="text-fg-subtle">Sources:</span>{" "}
              <span className="text-fg">{viewRun.inputSnapshot.sourceNames.join(", ")}</span>
            </div>
          </div>
        </div>

        {viewRun.status === "failed" && viewRun.errorMessage && (
          <div className="surface-card p-4 border-danger/30">
            <div className="flex items-center gap-2 text-danger">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">Error: {viewRun.errorMessage}</p>
            </div>
          </div>
        )}

        {viewRun.subjects.length > 0 && (
          <div className="surface-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
                <Users className="h-4 w-4 text-iris-400" />
                Subject List
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-elev">
                    <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">ID</th>
                    <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Name</th>
                    <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Contact</th>
                    <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Type</th>
                    <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider">Matched Fields</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {pageSubjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-bg-elev/50">
                      <td className="p-3 font-mono text-xs text-fg-subtle">{subject.id}</td>
                      <td className="p-3 text-fg font-medium">{subject.name}</td>
                      <td className="p-3 text-fg-muted">{subject.contactDetail}</td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-iris-400/10 text-iris-400">
                          {subject.contactType}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-fg-subtle font-mono max-w-[300px] truncate">
                        {Object.entries(subject.matchedFields)
                          .slice(0, 3)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                        {Object.keys(subject.matchedFields).length > 3 && "..."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && (
              <div className="flex items-center justify-between p-3 border-t border-border bg-bg-elev">
                <p className="text-xs text-fg-subtle">
                  Showing {page * PAGE_SIZE + 1}-
                  {Math.min((page + 1) * PAGE_SIZE, viewRun.subjects.length)} of{" "}
                  {viewRun.subjects.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="p-1.5 rounded hover:bg-surface text-fg-subtle disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-fg-muted">
                    Page {page + 1} of {pageCount}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(pageCount - 1, page + 1))}
                    disabled={page >= pageCount - 1}
                    className="p-1.5 rounded hover:bg-surface text-fg-subtle disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fg">Cohort Runs</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Execute criteria against the input matrix to identify cohorts
          </p>
        </div>
        <button
          onClick={() => setShowDict(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-fg text-sm hover:bg-surface-2 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Data Dictionary
        </button>
      </div>

      <div className="surface-card p-6">
        <h2 className="text-sm font-semibold text-fg mb-4 flex items-center gap-2">
          <Play className="h-4 w-4 text-success" />
          New Cohort Run
        </h2>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs text-fg-subtle uppercase tracking-wider mb-1.5">
              Select Criteria Set
            </label>
            <select
              value={selectedCriteriaId}
              onChange={(e) => setSelectedCriteriaId(e.target.value)}
              className="w-full bg-bg-elev border border-border rounded-lg px-3 py-2.5 text-sm text-fg focus:border-iris-400 focus:outline-none"
            >
              <option value="">Choose a criteria set...</option>
              {state.criteriaSets.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (v{c.version})
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-fg-subtle">
            {state.dataSources.length} source{state.dataSources.length !== 1 ? "s" : ""} &middot;{" "}
            {state.dataSources.reduce((a, s) => a + s.rowCount, 0).toLocaleString()} rows
          </div>
          <button
            onClick={handleRun}
            disabled={running || !selectedCriteriaId || state.dataSources.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            {running ? "Running..." : "Execute"}
          </button>
        </div>
      </div>

      {sortedRuns.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <Play className="h-12 w-12 text-fg-subtle mx-auto mb-3" />
          <p className="text-lg font-medium text-fg mb-1">No runs yet</p>
          <p className="text-sm text-fg-muted">Select a criteria set and click Execute to run your first cohort identification</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedRuns.map((run) => (
            <div key={run.id} className="surface-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  run.status === "completed" ? "bg-success/10" : "bg-danger/10"
                }`}>
                  {run.status === "completed" ? (
                    <Users className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-danger" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-fg font-mono">{run.runId}</p>
                    <span className="text-xs bg-iris-500/15 text-iris-400 px-2 py-0.5 rounded-full">
                      {run.criteriaName} v{run.criteriaVersion}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-fg-subtle">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(run.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {run.inputSnapshot.snapshotHash}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {run.inputSnapshot.sourceNames.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-2">
                  <p className="text-lg font-bold font-mono text-fg">{run.resultCount}</p>
                  <p className="text-xs text-fg-subtle">subjects</p>
                </div>
                <button
                  onClick={() => {
                    setViewRun(run);
                    setPage(0);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs text-iris-400 hover:bg-iris-500/10 transition-colors"
                >
                  <Eye className="h-3 w-3" /> View
                </button>
                <button
                  onClick={() => exportRun(run)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs text-fg-muted hover:bg-surface transition-colors"
                >
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
