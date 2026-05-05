"use client";

import type { EipState, DataSource, CriteriaSet, CohortRun } from "./types";

const STORAGE_KEY = "eip_state";

function getDefaultState(): EipState {
  return { dataSources: [], criteriaSets: [], runs: [] };
}

export function loadState(): EipState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw) as EipState;
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: EipState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addDataSource(source: DataSource): EipState {
  const state = loadState();
  state.dataSources.push(source);
  saveState(state);
  return state;
}

export function updateDataSource(source: DataSource): EipState {
  const state = loadState();
  const idx = state.dataSources.findIndex((s) => s.id === source.id);
  if (idx !== -1) state.dataSources[idx] = source;
  saveState(state);
  return state;
}

export function removeDataSource(id: string): EipState {
  const state = loadState();
  state.dataSources = state.dataSources.filter((s) => s.id !== id);
  saveState(state);
  return state;
}

export function addCriteriaSet(criteria: CriteriaSet): EipState {
  const state = loadState();
  state.criteriaSets.push(criteria);
  saveState(state);
  return state;
}

export function updateCriteriaSet(criteria: CriteriaSet): EipState {
  const state = loadState();
  const idx = state.criteriaSets.findIndex((c) => c.id === criteria.id);
  if (idx !== -1) state.criteriaSets[idx] = criteria;
  saveState(state);
  return state;
}

export function removeCriteriaSet(id: string): EipState {
  const state = loadState();
  state.criteriaSets = state.criteriaSets.filter((c) => c.id !== id);
  saveState(state);
  return state;
}

export function addRun(run: CohortRun): EipState {
  const state = loadState();
  state.runs.push(run);
  saveState(state);
  return state;
}

export function getRun(runId: string): CohortRun | undefined {
  const state = loadState();
  return state.runs.find((r) => r.id === runId);
}
