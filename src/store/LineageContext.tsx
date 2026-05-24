import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { LINEAGE_DB, TARGET_ID } from '../data/mockLineage';
import { ancestorsOf } from '../utils/ancestors';
import { computeLayout } from '../utils/layout';
import type { LineageMap, Positions } from '../types/lineage';

interface LineageContextValue {
  lineage: LineageMap;
  targetId: string;
  expanded: Set<string>;
  selectedId: string | null;
  focusMode: boolean;
  positions: Positions;
  focusSet: Set<string> | null;
  visibleNodeIds: string[];
  totalNodes: number;
  setSelectedId: (id: string | null) => void;
  setFocusMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  toggleNode: (id: string) => void;
  expandFullUpstream: (id: string) => void;
  collapseAll: () => void;
  addExpanded: (id: string) => void;
}

const LineageContext = createContext<LineageContextValue | null>(null);

interface LineageProviderProps {
  children: React.ReactNode;
}

export const LineageProvider: React.FC<LineageProviderProps> = ({
  children,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [selectedId, setSelectedId] = useState<string | null>(TARGET_ID);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  const positions = useMemo(
    () => computeLayout(LINEAGE_DB, expanded, TARGET_ID),
    [expanded],
  );

  const focusSet = useMemo(
    () =>
      focusMode && selectedId
        ? ancestorsOf(LINEAGE_DB, selectedId, expanded)
        : null,
    [focusMode, selectedId, expanded],
  );

  const toggleNode = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);

      // Recursively remove a node and its entire expanded upstream subtree.
      const collapseSubtree = (nid: string) => {
        if (!next.has(nid)) return;
        next.delete(nid);
        const n = LINEAGE_DB[nid];
        if (!n) return;
        for (const p of n.parents) collapseSubtree(p);
      };

      if (next.has(id)) {
        // Already expanded → collapse it and its subtree.
        collapseSubtree(id);
      } else {
        // Expanding → first collapse every sibling at the same level.
        // Siblings are the other parents that share the same child node.
        for (const nodeId in LINEAGE_DB) {
          const node = LINEAGE_DB[nodeId];
          if (node.parents.includes(id)) {
            // nodeId is a child of `id`; its other parents are siblings.
            for (const siblingId of node.parents) {
              if (siblingId !== id) collapseSubtree(siblingId);
            }
          }
        }
        next.add(id);
      }

      return next;
    });
  }, []);

  const expandFullUpstream = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      const walk = (nid: string) => {
        const n = LINEAGE_DB[nid];
        if (!n || n.parents.length === 0) return;
        next.add(nid);
        for (const p of n.parents) walk(p);
      };
      walk(id);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setExpanded(new Set());
    setSelectedId(TARGET_ID);
  }, []);

  const addExpanded = useCallback((id: string) => {
    setExpanded((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const visibleNodeIds = useMemo(() => Object.keys(positions), [positions]);
  const totalNodes = useMemo(() => Object.keys(LINEAGE_DB).length, []);

  const value: LineageContextValue = {
    lineage: LINEAGE_DB,
    targetId: TARGET_ID,
    expanded,
    selectedId,
    focusMode,
    positions,
    focusSet,
    visibleNodeIds,
    totalNodes,
    setSelectedId,
    setFocusMode,
    toggleNode,
    expandFullUpstream,
    collapseAll,
    addExpanded,
  };

  return (
    <LineageContext.Provider value={value}>{children}</LineageContext.Provider>
  );
};

export const useLineage = (): LineageContextValue => {
  const ctx = useContext(LineageContext);
  if (!ctx) {
    throw new Error('useLineage must be used inside <LineageProvider>');
  }
  return ctx;
};
