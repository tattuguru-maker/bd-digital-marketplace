"use client";

import type { RuleGroup, RuleCondition, Operator } from "@/lib/eip/types";
import { Plus, Trash2, GitBranch } from "lucide-react";

const OPERATORS: { value: Operator; label: string; needsValue: boolean; needsRange: boolean }[] = [
  { value: "equals", label: "Equals", needsValue: true, needsRange: false },
  { value: "not_equals", label: "Not Equals", needsValue: true, needsRange: false },
  { value: "greater_than", label: "Greater Than", needsValue: true, needsRange: false },
  { value: "less_than", label: "Less Than", needsValue: true, needsRange: false },
  { value: "greater_equal", label: "Greater or Equal", needsValue: true, needsRange: false },
  { value: "less_equal", label: "Less or Equal", needsValue: true, needsRange: false },
  { value: "between", label: "Between", needsValue: true, needsRange: true },
  { value: "contains", label: "Contains", needsValue: true, needsRange: false },
  { value: "not_contains", label: "Not Contains", needsValue: true, needsRange: false },
  { value: "starts_with", label: "Starts With", needsValue: true, needsRange: false },
  { value: "ends_with", label: "Ends With", needsValue: true, needsRange: false },
  { value: "is_empty", label: "Is Empty", needsValue: false, needsRange: false },
  { value: "is_not_empty", label: "Is Not Empty", needsValue: false, needsRange: false },
  { value: "in_list", label: "In List (comma-sep)", needsValue: true, needsRange: false },
];

function newCondition(): RuleCondition {
  return {
    id: crypto.randomUUID(),
    field: "",
    operator: "equals",
    value: "",
  };
}

function newGroup(): RuleGroup {
  return {
    id: crypto.randomUUID(),
    logic: "AND",
    conditions: [newCondition()],
    groups: [],
  };
}

interface RuleGroupEditorProps {
  group: RuleGroup;
  onChange: (group: RuleGroup) => void;
  onRemove?: () => void;
  fields: string[];
  depth?: number;
}

function RuleGroupEditor({ group, onChange, onRemove, fields, depth = 0 }: RuleGroupEditorProps) {
  const toggleLogic = () => {
    onChange({ ...group, logic: group.logic === "AND" ? "OR" : "AND" });
  };

  const updateCondition = (idx: number, updated: RuleCondition) => {
    const conditions = [...group.conditions];
    conditions[idx] = updated;
    onChange({ ...group, conditions });
  };

  const removeCondition = (idx: number) => {
    const conditions = group.conditions.filter((_, i) => i !== idx);
    onChange({ ...group, conditions });
  };

  const addCondition = () => {
    onChange({ ...group, conditions: [...group.conditions, newCondition()] });
  };

  const addSubGroup = () => {
    onChange({ ...group, groups: [...group.groups, newGroup()] });
  };

  const updateSubGroup = (idx: number, updated: RuleGroup) => {
    const groups = [...group.groups];
    groups[idx] = updated;
    onChange({ ...group, groups });
  };

  const removeSubGroup = (idx: number) => {
    const groups = group.groups.filter((_, i) => i !== idx);
    onChange({ ...group, groups });
  };

  const borderColor = depth === 0 ? "border-iris-500/30" : depth === 1 ? "border-cyan-400/30" : "border-gold-400/30";
  const logicColor = group.logic === "AND" ? "bg-iris-500/20 text-iris-300" : "bg-cyan-400/20 text-cyan-400";

  return (
    <div className={`border ${borderColor} rounded-lg p-4 space-y-3 ${depth > 0 ? "ml-4" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLogic}
            className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${logicColor} hover:opacity-80 transition-opacity`}
          >
            {group.logic}
          </button>
          <span className="text-xs text-fg-subtle">
            {group.logic === "AND" ? "All conditions must match" : "Any condition can match"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded hover:bg-danger/10 text-fg-subtle hover:text-danger transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {group.conditions.map((cond, idx) => {
          const opMeta = OPERATORS.find((o) => o.value === cond.operator);
          return (
            <div key={cond.id} className="flex items-center gap-2 flex-wrap">
              <select
                value={cond.field}
                onChange={(e) => updateCondition(idx, { ...cond, field: e.target.value })}
                className="bg-bg-elev border border-border rounded-md px-2.5 py-1.5 text-xs text-fg focus:border-iris-400 focus:outline-none min-w-[140px]"
              >
                <option value="">Select field...</option>
                {fields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <select
                value={cond.operator}
                onChange={(e) =>
                  updateCondition(idx, { ...cond, operator: e.target.value as Operator })
                }
                className="bg-bg-elev border border-border rounded-md px-2.5 py-1.5 text-xs text-fg focus:border-iris-400 focus:outline-none"
              >
                {OPERATORS.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>

              {opMeta?.needsValue && (
                <input
                  type="text"
                  value={String(cond.value)}
                  onChange={(e) => updateCondition(idx, { ...cond, value: e.target.value })}
                  placeholder="Value..."
                  className="bg-bg-elev border border-border rounded-md px-2.5 py-1.5 text-xs text-fg focus:border-iris-400 focus:outline-none min-w-[100px]"
                />
              )}

              {opMeta?.needsRange && (
                <>
                  <span className="text-xs text-fg-subtle">to</span>
                  <input
                    type="text"
                    value={String(cond.valueTo ?? "")}
                    onChange={(e) => updateCondition(idx, { ...cond, valueTo: e.target.value })}
                    placeholder="Max..."
                    className="bg-bg-elev border border-border rounded-md px-2.5 py-1.5 text-xs text-fg focus:border-iris-400 focus:outline-none min-w-[100px]"
                  />
                </>
              )}

              {group.conditions.length > 1 && (
                <button
                  onClick={() => removeCondition(idx)}
                  className="p-1 rounded hover:bg-danger/10 text-fg-subtle hover:text-danger transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {group.groups.map((sub, idx) => (
        <RuleGroupEditor
          key={sub.id}
          group={sub}
          onChange={(g) => updateSubGroup(idx, g)}
          onRemove={() => removeSubGroup(idx)}
          fields={fields}
          depth={depth + 1}
        />
      ))}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={addCondition}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-iris-400 hover:bg-iris-500/10 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add Condition
        </button>
        {depth < 3 && (
          <button
            onClick={addSubGroup}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-cyan-400 hover:bg-cyan-400/10 transition-colors"
          >
            <GitBranch className="h-3 w-3" /> Add Group
          </button>
        )}
      </div>
    </div>
  );
}

export { RuleGroupEditor, newGroup, newCondition };
