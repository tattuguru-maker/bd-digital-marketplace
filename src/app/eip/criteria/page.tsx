"use client";

import { useState, useMemo } from "react";
import { useEip } from "@/lib/eip/context";
import { RuleGroupEditor, newGroup } from "@/components/eip/rule-builder";
import type { CriteriaSet, RuleGroup } from "@/lib/eip/types";
import { Filter, Plus, Edit3, Trash2, Copy, Save, X, History } from "lucide-react";

export default function CriteriaPage() {
  const { state, addCriteria, updateCriteria, removeCriteria, isLoaded } = useEip();
  const [editing, setEditing] = useState<CriteriaSet | null>(null);
  const [isNew, setIsNew] = useState(false);

  const allFields = useMemo(() => {
    const fields = new Set<string>();
    state.dataSources.forEach((s) => {
      s.mappings.forEach((m) => fields.add(m.targetField));
    });
    return Array.from(fields);
  }, [state.dataSources]);

  const startNew = () => {
    const criteria: CriteriaSet = {
      id: crypto.randomUUID(),
      name: "",
      version: 1,
      description: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rootGroup: newGroup(),
    };
    setEditing(criteria);
    setIsNew(true);
  };

  const startEdit = (criteria: CriteriaSet) => {
    setEditing({ ...criteria, rootGroup: JSON.parse(JSON.stringify(criteria.rootGroup)) });
    setIsNew(false);
  };

  const duplicateCriteria = (criteria: CriteriaSet) => {
    const dup: CriteriaSet = {
      ...criteria,
      id: crypto.randomUUID(),
      name: `${criteria.name} (copy)`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rootGroup: JSON.parse(JSON.stringify(criteria.rootGroup)),
    };
    addCriteria(dup);
  };

  const saveCriteria = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      alert("Please enter a name for this criteria set");
      return;
    }

    const updated = {
      ...editing,
      updatedAt: new Date().toISOString(),
    };

    if (isNew) {
      addCriteria(updated);
    } else {
      updated.version = editing.version + 1;
      updateCriteria(updated);
    }
    setEditing(null);
    setIsNew(false);
  };

  if (!isLoaded) {
    return <div className="animate-pulse text-fg-subtle p-8">Loading...</div>;
  }

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-fg">
              {isNew ? "New Criteria Set" : `Edit: ${editing.name}`}
            </h1>
            <p className="mt-1 text-sm text-fg-muted">
              Define boolean rules and threshold filters to identify target cohorts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditing(null);
                setIsNew(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-fg text-sm hover:bg-surface-2 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={saveCriteria}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Save className="h-4 w-4" />
              {isNew ? "Create" : `Save as v${editing.version + 1}`}
            </button>
          </div>
        </div>

        <div className="surface-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-fg-subtle uppercase tracking-wider mb-1.5">
                Criteria Name
              </label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g., Housing Risk - Over 65s"
                className="w-full bg-bg-elev border border-border rounded-lg px-3 py-2.5 text-sm text-fg focus:border-iris-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-fg-subtle uppercase tracking-wider mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Describe the purpose of this criteria set..."
                className="w-full bg-bg-elev border border-border rounded-lg px-3 py-2.5 text-sm text-fg focus:border-iris-400 focus:outline-none"
              />
            </div>
          </div>

          {!isNew && (
            <div className="flex items-center gap-4 text-xs text-fg-subtle">
              <span>Version: {editing.version}</span>
              <span>Created: {new Date(editing.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(editing.updatedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-iris-400" />
            <h2 className="text-sm font-semibold text-fg">Rule Configuration</h2>
          </div>

          {allFields.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-fg-muted">No fields available</p>
              <p className="text-xs text-fg-subtle mt-1">Upload data sources first to use field names in rules</p>
            </div>
          ) : (
            <RuleGroupEditor
              group={editing.rootGroup}
              onChange={(rootGroup: RuleGroup) => setEditing({ ...editing, rootGroup })}
              fields={allFields}
            />
          )}

          <div className="mt-4 p-3 bg-bg-elev rounded-lg">
            <p className="text-xs text-fg-subtle">
              <span className="font-medium text-fg-muted">Available fields:</span>{" "}
              {allFields.length > 0 ? allFields.join(", ") : "None (upload data sources first)"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fg">Criteria Builder</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Create and manage versioned criteria sets for cohort identification
          </p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Criteria Set
        </button>
      </div>

      {state.criteriaSets.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <Filter className="h-12 w-12 text-fg-subtle mx-auto mb-3" />
          <p className="text-lg font-medium text-fg mb-1">No criteria sets yet</p>
          <p className="text-sm text-fg-muted mb-4">
            Create your first criteria set to define rules for identifying cohorts
          </p>
          <button
            onClick={startNew}
            className="px-4 py-2 rounded-lg brand-gradient text-white text-sm font-medium"
          >
            Create First Criteria Set
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.criteriaSets.map((criteria) => {
            const condCount = countConditions(criteria.rootGroup);
            const groupCount = countGroups(criteria.rootGroup);
            return (
              <div key={criteria.id} className="surface-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-fg">{criteria.name}</h3>
                    {criteria.description && (
                      <p className="text-xs text-fg-muted mt-0.5">{criteria.description}</p>
                    )}
                  </div>
                  <span className="text-xs bg-iris-500/15 text-iris-400 px-2 py-0.5 rounded-full font-mono">
                    v{criteria.version}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-fg-subtle">
                  <span>{condCount} condition{condCount !== 1 ? "s" : ""}</span>
                  <span>{groupCount} group{groupCount !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1">
                    <History className="h-3 w-3" />
                    {new Date(criteria.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => startEdit(criteria)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-iris-400 hover:bg-iris-500/10 transition-colors"
                  >
                    <Edit3 className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => duplicateCriteria(criteria)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-fg-muted hover:bg-surface transition-colors"
                  >
                    <Copy className="h-3 w-3" /> Duplicate
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this criteria set?")) removeCriteria(criteria.id);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function countConditions(group: RuleGroup): number {
  return group.conditions.length + group.groups.reduce((sum, g) => sum + countConditions(g), 0);
}

function countGroups(group: RuleGroup): number {
  return 1 + group.groups.reduce((sum, g) => sum + countGroups(g), 0);
}
