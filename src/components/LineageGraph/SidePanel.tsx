import React from 'react';
import { ChevronRight, Code2, GitBranch, X } from 'lucide-react';
import { TRANSFORM_KINDS } from '../../constants/lineage';
import type { LineageMap } from '../../types/lineage';

interface SidePanelProps {
  selectedId: string | null;
  lineage: LineageMap;
  onClose: () => void;
  onExpandPath: (id: string) => void;
  onJump: (id: string) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  selectedId,
  lineage,
  onClose,
  onExpandPath,
  onJump,
}) => {
  if (!selectedId) return null;
  const node = lineage[selectedId];
  if (!node) return null;

  const directParents = node.parents.map((id) => lineage[id]).filter(Boolean);
  const kind = TRANSFORM_KINDS[node.type];
  const sat = kind.sat === 0 ? 0 : 70;

  return (
    <div
      className="absolute top-4 right-4 w-[340px] bg-zinc-950/95 border border-zinc-800 rounded-xl backdrop-blur-md flex flex-col"
      style={{
        maxHeight: 'calc(100% - 200px)',
        boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8)',
      }}
    >
      <div className="flex items-start justify-between px-4 pt-3.5 pb-3 border-b border-zinc-800">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded"
              style={{
                background: `hsl(${kind.hue},${sat}%,15%)`,
                color: `hsl(${kind.hue},${sat}%,70%)`,
              }}
            >
              {kind.label}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {node.dataType}
            </span>
          </div>
          <div className="font-mono text-[15px] text-zinc-100 font-medium truncate">
            {node.name}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">
            {node.table}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-200 ml-2"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-4 py-3 border-b border-zinc-800">
        <div className="text-[9px] text-zinc-500 tracking-wider mb-1.5 flex items-center gap-1.5">
          <Code2 size={10} /> TRANSFORMATION
        </div>
        <div className="font-mono text-[11.5px] text-zinc-300 leading-relaxed bg-zinc-900/60 rounded-md p-2.5 border border-zinc-800/60">
          {node.transformation}
        </div>
      </div>

      <div className="px-4 py-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] text-zinc-500 tracking-wider flex items-center gap-1.5">
            <GitBranch size={10} /> UPSTREAM ({directParents.length})
          </div>
          {directParents.length > 0 && (
            <button
              onClick={() => onExpandPath(selectedId)}
              className="text-[10px] text-zinc-400 hover:text-amber-400 transition-colors"
            >
              Expand all →
            </button>
          )}
        </div>

        {directParents.length === 0 ? (
          <div className="text-[11px] text-zinc-600 italic font-mono py-2">
            Source column — no upstream.
          </div>
        ) : (
          <div className="space-y-1.5">
            {directParents.map((p) => {
              const pk = TRANSFORM_KINDS[p.type];
              const pSat = pk.sat === 0 ? 0 : 70;
              return (
                <button
                  key={p.id}
                  onClick={() => onJump(p.id)}
                  className="w-full text-left px-2.5 py-2 rounded-md bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[12px] text-zinc-200 truncate">
                      {p.name}
                    </div>
                    <ChevronRight
                      size={12}
                      className="text-zinc-600 group-hover:text-zinc-300"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-[8px] font-semibold tracking-wider px-1 py-px rounded"
                      style={{
                        background: `hsl(${pk.hue},${pSat}%,15%)`,
                        color: `hsl(${pk.hue},${pSat}%,70%)`,
                      }}
                    >
                      {pk.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono truncate">
                      {p.table}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
