"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { EipState, DataSource, CriteriaSet, CohortRun } from "./types";
import {
  loadState,
  addDataSource as storageAddSource,
  updateDataSource as storageUpdateSource,
  removeDataSource as storageRemoveSource,
  addCriteriaSet as storageAddCriteria,
  updateCriteriaSet as storageUpdateCriteria,
  removeCriteriaSet as storageRemoveCriteria,
  addRun as storageAddRun,
} from "./storage";

interface EipContextValue {
  state: EipState;
  addSource: (source: DataSource) => void;
  updateSource: (source: DataSource) => void;
  removeSource: (id: string) => void;
  addCriteria: (criteria: CriteriaSet) => void;
  updateCriteria: (criteria: CriteriaSet) => void;
  removeCriteria: (id: string) => void;
  addRun: (run: CohortRun) => void;
  isLoaded: boolean;
}

const EipContext = createContext<EipContextValue | null>(null);

export function EipProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EipState>({ dataSources: [], criteriaSets: [], runs: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    const update = () => {
      setState(loaded);
      setIsLoaded(true);
    };
    update();
  }, []);

  const addSource = useCallback((source: DataSource) => {
    setState(storageAddSource(source));
  }, []);

  const updateSource = useCallback((source: DataSource) => {
    setState(storageUpdateSource(source));
  }, []);

  const removeSource = useCallback((id: string) => {
    setState(storageRemoveSource(id));
  }, []);

  const addCriteria = useCallback((criteria: CriteriaSet) => {
    setState(storageAddCriteria(criteria));
  }, []);

  const updateCriteria = useCallback((criteria: CriteriaSet) => {
    setState(storageUpdateCriteria(criteria));
  }, []);

  const removeCriteria = useCallback((id: string) => {
    setState(storageRemoveCriteria(id));
  }, []);

  const addRunCb = useCallback((run: CohortRun) => {
    setState(storageAddRun(run));
  }, []);

  return (
    <EipContext value={{
      state,
      addSource,
      updateSource,
      removeSource,
      addCriteria,
      updateCriteria,
      removeCriteria,
      addRun: addRunCb,
      isLoaded,
    }}>
      {children}
    </EipContext>
  );
}

export function useEip(): EipContextValue {
  const ctx = useContext(EipContext);
  if (!ctx) throw new Error("useEip must be used within EipProvider");
  return ctx;
}
