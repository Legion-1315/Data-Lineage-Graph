import { LVL_GAP, NODE_H, NODE_W, SIB_GAP } from '../constants/lineage';
import type { LineageMap, Positions } from '../types/lineage';

interface PlaceResult {
  h: number;
  cy: number;
}

export const computeLayout = (
  lineage: LineageMap,
  expanded: Set<string>,
  targetId: string,
): Positions => {
  const positions: Positions = {};

  const place = (id: string, leftX: number, topY: number): PlaceResult => {
    const node = lineage[id];
    if (!node) return { h: 0, cy: topY + NODE_H / 2 };
    const expanded_ = expanded.has(id);

    if (!expanded_ || node.parents.length === 0) {
      positions[id] = { x: leftX, y: topY };
      return { h: NODE_H, cy: topY + NODE_H / 2 };
    }

    let cursorY = topY;
    const childCenters: number[] = [];
    const parentLeftX = leftX + NODE_W + LVL_GAP;
    for (const pid of node.parents) {
      const { h, cy } = place(pid, parentLeftX, cursorY);
      childCenters.push(cy);
      cursorY += h + SIB_GAP;
    }
    const totalH = cursorY - topY - SIB_GAP;
    const myCy =
      (childCenters[0] + childCenters[childCenters.length - 1]) / 2;
    positions[id] = { x: leftX, y: myCy - NODE_H / 2 };
    return { h: Math.max(totalH, NODE_H), cy: myCy };
  };

  place(targetId, 0, 0);
  return positions;
};
