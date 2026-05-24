import React from 'react';
import {
  Crosshair,
  Layers,
  RotateCcw,
  Search,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface TopBarProps {
  visibleCount: number;
  totalCount: number;
  focusMode: boolean;
  onToggleFocus: () => void;
  onOpenSearch: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  visibleCount,
  totalCount,
  focusMode,
  onToggleFocus,
  onOpenSearch,
  onZoomIn,
  onZoomOut,
  onReset,
}) => (
  <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm z-30">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, hsl(38,90%,55%), hsl(20,90%,50%))',
          }}
        >
          <Layers size={15} className="text-zinc-900" />
        </div>
        <div>
          <div className="text-[13px] font-semibold tracking-tight">
            Column Lineage
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {visibleCount} visible · {totalCount} total
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-1.5">
      <button
        onClick={onOpenSearch}
        className="h-8 px-2.5 flex items-center gap-1.5 text-[12px] rounded-md border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-colors text-zinc-300"
      >
        <Search size={13} /> Search
        <span className="text-[9px] font-mono text-zinc-500 ml-1 px-1 py-px rounded bg-zinc-900 border border-zinc-800">
          ⌘K
        </span>
      </button>
      <button
        onClick={onToggleFocus}
        className={`h-8 px-2.5 flex items-center gap-1.5 text-[12px] rounded-md border transition-colors ${
          focusMode
            ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300'
        }`}
        title="Highlight only the path from the selected node to its sources"
      >
        <Crosshair size={13} /> Focus
      </button>
      <div className="w-px h-5 bg-zinc-800 mx-1" />
      <button
        onClick={onZoomIn}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-800 hover:bg-zinc-900 text-zinc-400"
      >
        <ZoomIn size={13} />
      </button>
      <button
        onClick={onZoomOut}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-800 hover:bg-zinc-900 text-zinc-400"
      >
        <ZoomOut size={13} />
      </button>
      <button
        onClick={onReset}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-800 hover:bg-zinc-900 text-zinc-400"
        title="Reset"
      >
        <RotateCcw size={13} />
      </button>
    </div>
  </div>
);
