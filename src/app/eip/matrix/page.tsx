"use client";

import { useState, useMemo } from "react";
import { useEip } from "@/lib/eip/context";
import { buildMatrix } from "@/lib/eip/engine";
import { Grid3X3, Search, Download, ChevronLeft, ChevronRight, Database } from "lucide-react";
import { generateCSVExport } from "@/lib/eip/csv";

const PAGE_SIZE = 25;

export default function MatrixPage() {
  const { state, isLoaded } = useEip();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string>("all");

  const matrix = useMemo(() => {
    if (!isLoaded) return [];
    return buildMatrix(state.dataSources);
  }, [state.dataSources, isLoaded]);

  const filteredMatrix = useMemo(() => {
    let rows = matrix;
    if (selectedSource !== "all") {
      rows = rows.filter((r) => r.__sourceId === selectedSource);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return rows;
  }, [matrix, search, selectedSource]);

  const allColumns = useMemo(() => {
    const cols = new Set<string>();
    matrix.forEach((r) => {
      Object.keys(r).forEach((k) => {
        if (!k.startsWith("__")) cols.add(k);
      });
    });
    return Array.from(cols);
  }, [matrix]);

  const pageCount = Math.ceil(filteredMatrix.length / PAGE_SIZE);
  const pageRows = filteredMatrix.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const exportAll = () => {
    const csv = generateCSVExport(
      allColumns,
      filteredMatrix.map((r) => {
        const clean: Record<string, unknown> = {};
        allColumns.forEach((c) => (clean[c] = r[c]));
        return clean;
      })
    );
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "input-matrix.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isLoaded) {
    return <div className="animate-pulse text-fg-subtle p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fg">Input Matrix</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Unified view of all ingested data sources ({matrix.length.toLocaleString()} total rows across{" "}
            {state.dataSources.length} sources)
          </p>
        </div>
        <button
          onClick={exportAll}
          disabled={matrix.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-fg text-sm font-medium hover:bg-surface-2 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {matrix.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <Grid3X3 className="h-12 w-12 text-fg-subtle mx-auto mb-3" />
          <p className="text-lg font-medium text-fg mb-1">No data in matrix</p>
          <p className="text-sm text-fg-muted">Upload data sources first to populate the input matrix</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-subtle" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search across all fields..."
                className="w-full bg-bg-elev border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:border-iris-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-fg-subtle" />
              <select
                value={selectedSource}
                onChange={(e) => {
                  setSelectedSource(e.target.value);
                  setPage(0);
                }}
                className="bg-bg-elev border border-border rounded-lg px-3 py-2.5 text-sm text-fg focus:border-iris-400 focus:outline-none"
              >
                <option value="all">All Sources</option>
                {state.dataSources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider font-medium bg-bg-elev sticky left-0 z-10">
                      #
                    </th>
                    {allColumns.map((col) => (
                      <th
                        key={col}
                        className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider font-medium bg-bg-elev whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                    <th className="text-left p-3 text-xs text-fg-subtle uppercase tracking-wider font-medium bg-bg-elev">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {pageRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-bg-elev/50 transition-colors">
                      <td className="p-3 font-mono text-xs text-fg-subtle sticky left-0 bg-bg/80 backdrop-blur-sm">
                        {page * PAGE_SIZE + idx + 1}
                      </td>
                      {allColumns.map((col) => (
                        <td key={col} className="p-3 text-fg-muted font-mono text-xs whitespace-nowrap max-w-[200px] truncate">
                          {String(row[col] ?? "")}
                        </td>
                      ))}
                      <td className="p-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-iris-400/10 text-iris-400">
                          {String(row.__sourceName ?? "")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3 border-t border-border bg-bg-elev">
              <p className="text-xs text-fg-subtle">
                Showing {page * PAGE_SIZE + 1}-
                {Math.min((page + 1) * PAGE_SIZE, filteredMatrix.length)} of{" "}
                {filteredMatrix.length.toLocaleString()}
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
                  Page {page + 1} of {Math.max(1, pageCount)}
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
          </div>
        </>
      )}
    </div>
  );
}
