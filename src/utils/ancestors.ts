import type { LineageMap } from '../types/lineage';

export const ancestorsOf = (
  lineage: LineageMap,
  id: string,
  expanded: Set<string>,
): Set<string> => {
  const out = new Set<string>([id]);
  const walk = (nid: string) => {
    const n = lineage[nid];
    if (!n) return;
    for (const p of n.parents) {
      if (out.has(p)) continue;
      out.add(p);
      if (expanded.has(p)) walk(p);
    }
  };
  if (expanded.has(id)) walk(id);
  return out;
};
