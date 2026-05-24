import React, { memo } from 'react';
import { NODE_H, NODE_W, TRANSFORM_KINDS } from '../../constants/lineage';
import type { LineageMap, Positions, TransformKind } from '../../types/lineage';

interface EdgesProps {
  positions: Positions;
  lineage: LineageMap;
  expanded: Set<string>;
  focusSet: Set<string> | null;
}

interface PathEntry {
  id: string;
  d: string;
  inPath: boolean;
  type: TransformKind;
}

// Visual size of the arrowhead, in canvas pixels.
const ARROW_SIZE_NORMAL = 10;
const ARROW_SIZE_FOCUSED = 13;
// Small gap between the arrow tip and the parent node's edge so the
// arrowhead doesn't visually clip into the node card.
const ARROW_GAP = 6;

// Line stroke — moderately bright so the path is readable.
const strokeColorFor = (type: TransformKind, focused: boolean): string => {
  const k = TRANSFORM_KINDS[type];
  if (focused) {
    const sat = k.sat === 0 ? 0 : 80;
    return `hsl(${k.hue},${sat}%,65%)`;
  }
  const sat = k.sat === 0 ? 0 : 50;
  return `hsl(${k.hue},${sat}%,55%)`;
};

// Arrowhead fill — always very bright so the tip is unmissable.
const arrowColorFor = (type: TransformKind, focused: boolean): string => {
  const k = TRANSFORM_KINDS[type];
  if (focused) {
    const sat = k.sat === 0 ? 0 : 90;
    return `hsl(${k.hue},${sat}%,88%)`;
  }
  const sat = k.sat === 0 ? 0 : 80;
  return `hsl(${k.hue},${sat}%,78%)`;
};

const markerId = (type: TransformKind, focused: boolean) =>
  `arrow-${type}-${focused ? 'focused' : 'normal'}`;

const EdgesComponent: React.FC<EdgesProps> = ({
  positions,
  lineage,
  expanded,
  focusSet,
}) => {
  const paths: PathEntry[] = [];
  for (const id in positions) {
    if (!expanded.has(id)) continue;
    const node = lineage[id];
    if (!node) continue;
    const cp = positions[id];
    for (const pid of node.parents) {
      const pp = positions[pid];
      if (!pp) continue;
      // Mirrored layout: parent (upstream) is to the RIGHT of child.
      // Draw the path from CHILD -> PARENT so that marker-end lands on the
      // parent's edge, producing an arrow that visually points UPSTREAM.
      const childRight = cp.x + NODE_W;
      const childY = cp.y + NODE_H / 2;
      const parentLeft = pp.x - ARROW_GAP; // pull back so arrow tip sits just outside the node
      const parentY = pp.y + NODE_H / 2;
      const mid = (childRight + parentLeft) / 2;
      const d = `M ${childRight} ${childY} C ${mid} ${childY}, ${mid} ${parentY}, ${parentLeft} ${parentY}`;
      const inPath = !!(focusSet && focusSet.has(pid) && focusSet.has(id));
      paths.push({ id: `${pid}->${id}`, d, inPath, type: node.type });
    }
  }

  const kinds = Object.keys(TRANSFORM_KINDS) as TransformKind[];

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <defs>
        {kinds.flatMap((type) =>
          [false, true].map((focused) => {
            const size = focused ? ARROW_SIZE_FOCUSED : ARROW_SIZE_NORMAL;
            return (
              <marker
                key={markerId(type, focused)}
                id={markerId(type, focused)}
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerUnits="userSpaceOnUse"
                markerWidth={size}
                markerHeight={size}
                orient="auto"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill={arrowColorFor(type, focused)}
                />
              </marker>
            );
          }),
        )}
      </defs>
      {paths.map((p) => (
        <path
          key={p.id}
          d={p.d}
          stroke={strokeColorFor(p.type, p.inPath)}
          strokeWidth={p.inPath ? 2 : 1.4}
          fill="none"
          markerEnd={`url(#${markerId(p.type, p.inPath)})`}
          style={{ transition: 'stroke 200ms, stroke-width 200ms' }}
        />
      ))}
    </svg>
  );
};

export const Edges = memo(EdgesComponent);
