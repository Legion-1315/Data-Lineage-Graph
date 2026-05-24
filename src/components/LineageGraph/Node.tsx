import React, { memo } from 'react';
import { Minus, Plus, Table2 } from 'lucide-react';
import { NODE_H, NODE_W, TRANSFORM_KINDS } from '../../constants/lineage';
import type { LineageNode, Position } from '../../types/lineage';

interface NodeProps {
  node: LineageNode;
  pos: Position;
  isExpanded: boolean;
  isFocused: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  hasParents: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

const NodeComponent: React.FC<NodeProps> = ({
  node,
  pos,
  isExpanded,
  isFocused,
  isDimmed,
  isSelected,
  hasParents,
  onToggle,
  onSelect,
}) => {
  const kind = TRANSFORM_KINDS[node.type];
  const hue = kind.hue;
  const sat = kind.sat === 0 ? 0 : 70;
  const isTarget = node.isTarget;

  return (
    <div
      onClick={() => onSelect(node.id)}
      style={{
        position: 'absolute',
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: NODE_W,
        height: NODE_H,
        opacity: isDimmed ? 0.25 : 1,
        transition:
          'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms',
        zIndex: isSelected ? 20 : isFocused ? 10 : 1,
      }}
      className="group cursor-pointer"
    >
      <div
        style={{
          background: isTarget
            ? 'linear-gradient(180deg, #1a1a1f 0%, #0f0f12 100%)'
            : 'linear-gradient(180deg, #18181b 0%, #0e0e10 100%)',
          border: `1px solid ${
            isSelected
              ? `hsl(${hue},${sat}%,55%)`
              : isFocused
                ? `hsl(${hue},${sat}%,40%)`
                : '#27272a'
          }`,
          boxShadow: isSelected
            ? `0 0 0 1px hsl(${hue},${sat}%,55%), 0 12px 32px -8px hsl(${hue},${sat}%,40%,0.4)`
            : isFocused
              ? `0 8px 24px -10px hsl(${hue},${sat}%,30%,0.5)`
              : '0 4px 12px -4px rgba(0,0,0,0.5)',
        }}
        className="relative h-full rounded-lg overflow-hidden"
      >
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: `hsl(${hue},${sat}%,55%)`,
          }}
        />
        {isTarget && (
          <div
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] tracking-widest font-semibold"
            style={{ background: 'hsl(38,90%,55%)', color: '#000' }}
          >
            TARGET
          </div>
        )}

        <div className="px-3.5 pt-2.5 pb-2 h-full flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded"
              style={{
                background: `hsl(${hue},${sat}%,15%)`,
                color: `hsl(${hue},${sat}%,70%)`,
              }}
            >
              {kind.label}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono truncate">
              {node.dataType}
            </span>
          </div>

          <div
            className="font-mono text-[15px] text-zinc-100 font-medium leading-tight truncate"
            title={node.name}
          >
            {node.name}
          </div>

          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-zinc-500 font-mono truncate">
            <Table2 size={10} />
            <span className="truncate" title={node.table}>
              {node.table}
            </span>
          </div>

          <div className="mt-auto text-[10.5px] text-zinc-400 font-mono leading-tight line-clamp-2 opacity-80">
            {node.transformation}
          </div>
        </div>

        {hasParents && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            style={{
              position: 'absolute',
              right: -12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 24,
              height: 24,
              background: isExpanded ? `hsl(${hue},${sat}%,55%)` : '#1f1f23',
              border: `1px solid ${
                isExpanded ? `hsl(${hue},${sat}%,65%)` : '#3f3f46'
              }`,
              color: isExpanded ? '#000' : '#a1a1aa',
            }}
            className="rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            title={isExpanded ? 'Collapse upstream' : 'Expand upstream'}
          >
            {isExpanded ? (
              <Minus size={12} strokeWidth={2.5} />
            ) : (
              <Plus size={12} strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export const Node = memo(NodeComponent);
