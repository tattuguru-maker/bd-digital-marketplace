"use client";

import { useState, useRef } from "react";
import { useEip } from "@/lib/eip/context";
import { parseCSV, autoDetectColumns } from "@/lib/eip/csv";
import type { DataSource, SchemaMapping } from "@/lib/eip/types";
import {
  Upload,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  ArrowRight,
  Columns3,
  Settings2,
} from "lucide-react";

export default function SourcesPage() {
  const { state, addSource, updateSource, removeSource, isLoaded } = useEip();
  const [uploading, setUploading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);
      const sourceName = file.name.replace(/\.csv$/i, "");
      const columns = autoDetectColumns(headers, rows, sourceName);

      const defaultMappings: SchemaMapping[] = headers.map((h) => ({
        sourceColumn: h,
        targetField: h,
        transform: "none" as const,
      }));

      const source: DataSource = {
        id: crypto.randomUUID(),
        name: sourceName,
        description: "",
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        rowCount: rows.length,
        columns,
        mappings: defaultMappings,
        rawData: rows,
      };

      addSource(source);
      setUploading(false);
      setShowUpload(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFile);
  };

  const handleMappingChange = (
    source: DataSource,
    colIdx: number,
    field: keyof SchemaMapping,
    value: string
  ) => {
    const updated = { ...source };
    updated.mappings = [...updated.mappings];
    updated.mappings[colIdx] = { ...updated.mappings[colIdx], [field]: value };
    updateSource(updated);
  };

  if (!isLoaded) {
    return <div className="animate-pulse text-fg-subtle p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fg">Data Sources</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Upload and manage council data sources with schema mapping and lineage tracking
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Upload className="h-4 w-4" />
          Add Source
        </button>
      </div>

      {showUpload && (
        <div
          className={`surface-card p-8 text-center transition-all ${
            dragOver ? "border-iris-400 bg-iris-500/5" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-fg-subtle mx-auto mb-3" />
          <p className="text-sm text-fg-muted mb-1">
            Drag &amp; drop a CSV file here, or click to browse
          </p>
          <p className="text-xs text-fg-subtle mb-4">
            Supports .csv files with automatic column type detection
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-iris-500 text-white text-sm font-medium hover:bg-iris-600 transition-colors disabled:opacity-50"
          >
            {uploading ? "Processing..." : "Choose File"}
          </button>
        </div>
      )}

      {state.dataSources.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <FileSpreadsheet className="h-12 w-12 text-fg-subtle mx-auto mb-3" />
          <p className="text-lg font-medium text-fg mb-1">No data sources yet</p>
          <p className="text-sm text-fg-muted mb-4">
            Upload CSV files from council data systems to get started
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 rounded-lg brand-gradient text-white text-sm font-medium"
          >
            Upload First Source
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {state.dataSources.map((source) => {
            const isExpanded = expandedId === source.id;
            return (
              <div key={source.id} className="surface-card overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg-elev/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : source.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                      <FileSpreadsheet className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-fg">{source.name}</p>
                      <p className="text-xs text-fg-subtle">
                        {source.fileName} &middot; {source.rowCount.toLocaleString()} rows &middot;{" "}
                        {source.columns.length} columns
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-fg-subtle">
                      {new Date(source.uploadedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Remove this data source?")) removeSource(source.id);
                      }}
                      className="p-1.5 rounded hover:bg-danger/10 text-fg-subtle hover:text-danger transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-fg-subtle" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-fg-subtle" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings2 className="h-4 w-4 text-iris-400" />
                      <h3 className="text-sm font-semibold text-fg">Schema Mapping</h3>
                    </div>
                    <p className="text-xs text-fg-subtle mb-3">
                      Map source columns to target fields. Optionally apply transforms.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-fg-subtle uppercase tracking-wider">
                            <th className="text-left pb-2 pr-4">Source Column</th>
                            <th className="text-center pb-2 px-2 w-8">&nbsp;</th>
                            <th className="text-left pb-2 pr-4">Target Field</th>
                            <th className="text-left pb-2 pr-4">Type</th>
                            <th className="text-left pb-2">Transform</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {source.mappings.map((mapping, idx) => (
                            <tr key={mapping.sourceColumn}>
                              <td className="py-2 pr-4">
                                <span className="font-mono text-xs bg-bg-elev px-2 py-1 rounded text-fg-muted">
                                  {mapping.sourceColumn}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-center">
                                <ArrowRight className="h-3 w-3 text-fg-subtle inline" />
                              </td>
                              <td className="py-2 pr-4">
                                <input
                                  type="text"
                                  value={mapping.targetField}
                                  onChange={(e) =>
                                    handleMappingChange(source, idx, "targetField", e.target.value)
                                  }
                                  className="w-full bg-bg-elev border border-border rounded px-2 py-1 text-xs text-fg font-mono focus:border-iris-400 focus:outline-none"
                                />
                              </td>
                              <td className="py-2 pr-4">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    source.columns[idx]?.type === "number"
                                      ? "bg-cyan-400/10 text-cyan-400"
                                      : source.columns[idx]?.type === "date"
                                        ? "bg-gold-400/10 text-gold-400"
                                        : source.columns[idx]?.type === "boolean"
                                          ? "bg-success/10 text-success"
                                          : "bg-iris-400/10 text-iris-400"
                                  }`}
                                >
                                  {source.columns[idx]?.type ?? "string"}
                                </span>
                              </td>
                              <td className="py-2">
                                <select
                                  value={mapping.transform ?? "none"}
                                  onChange={(e) =>
                                    handleMappingChange(source, idx, "transform", e.target.value)
                                  }
                                  className="bg-bg-elev border border-border rounded px-2 py-1 text-xs text-fg focus:border-iris-400 focus:outline-none"
                                >
                                  <option value="none">None</option>
                                  <option value="uppercase">Uppercase</option>
                                  <option value="lowercase">Lowercase</option>
                                  <option value="trim">Trim</option>
                                  <option value="toNumber">To Number</option>
                                  <option value="toDate">To Date</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Columns3 className="h-4 w-4 text-fg-subtle" />
                        <h3 className="text-sm font-semibold text-fg">Data Preview</h3>
                        <span className="text-xs text-fg-subtle">(first 5 rows)</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-fg-subtle uppercase tracking-wider border-b border-border">
                              {source.columns.map((col) => (
                                <th key={col.name} className="text-left pb-2 pr-4 font-medium">
                                  {col.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {source.rawData.slice(0, 5).map((row, i) => (
                              <tr key={i}>
                                {source.columns.map((col) => (
                                  <td key={col.name} className="py-1.5 pr-4 text-fg-muted font-mono">
                                    {String(row[col.name] ?? "")}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-bg-elev rounded-lg">
                      <p className="text-xs text-fg-subtle">
                        <span className="font-medium text-fg-muted">Source Lineage:</span>{" "}
                        {source.fileName} &rarr; uploaded {new Date(source.uploadedAt).toLocaleString()}{" "}
                        &rarr; {source.rowCount} rows, {source.columns.length} columns &rarr; source ID:{" "}
                        <span className="font-mono">{source.id.slice(0, 8)}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
