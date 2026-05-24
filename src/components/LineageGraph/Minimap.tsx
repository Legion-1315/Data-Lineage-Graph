import React from 'react';
import { NODE_H, NODE_W, TRANSFORM_KINDS } from '../../constants/lineage';
import type {
  CanvasSize,
  LineageMap,
  Positions,
  Viewport,
} from '../../types/lineage';

interface MinimapProps {
  positions: Positions;
  viewport: Viewport;
  canvasSize: CanvasSize;
  lineage: LineageMap;
}

const MAP_W = 180;
const MAP_H = 120;

export const Minimap: React.FC<MinimapProps> = ({
  positions,
  viewport,
  canvasSize,
  lineage,
}) => {
  const ids = Object.keys(positions);
  if (ids.length === 0) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const id of ids) {
    const p = positions[id];
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x + NODE_W);
    maxY = Math.max(maxY, p.y + NODE_H);
  }
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const scale = Math.min(MAP_W / w, MAP_H / h) * 0.9;
  const offX = (MAP_W - w * scale) / 2 - minX * scale;
  const offY = (MAP_H - h * scale) / 2 - minY * scale;

  const vw = canvasSize.w / viewport.scale;
  const vh = canvasSize.h / viewport.scale;
  const vx = -viewport.x / viewport.scale;
  const vy = -viewport.y / viewport.scale;

  return (
    <div
      style={{ width: MAP_W, height: MAP_H }}
      className="absolute bottom-4 right-4 bg-zinc-950/95 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur-sm"
    >
      <div className="px-2 py-1 text-[9px] text-zinc-500 tracking-wider border-b border-zinc-800 font-mono">
        MAP
      </div>
      <svg width={MAP_W} height={MAP_H - 18}>
        {ids.map((id) => {
          const p = positions[id];
          const node = lineage[id];
          const k = TRANSFORM_KINDS[node.type];
          const sat = k.sat === 0 ? 0 : 60;
          return (
            <rect
              key={id}
              x={p.x * scale + offX}
              y={p.y * scale + offY}
              width={NODE_W * scale}
              height={NODE_H * scale}
              fill={`hsl(${k.hue},${sat}%,50%)`}
              opacity={node.isTarget ? 1 : 0.6}
              rx={1}
            />
          );
        })}
        <rect
          x={vx * scale + offX}
          y={vy * scale + offY}
          width={vw * scale}
          height={vh * scale}
          fill="none"
          stroke="#fafafa"
          strokeWidth={1}
          strokeDasharray="3,2"
        />
      </svg>
    </div>
  );
};
