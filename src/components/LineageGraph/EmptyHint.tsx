import React from 'react';
import { Plus } from 'lucide-react';

export const EmptyHint: React.FC = () => (
  <div className="absolute top-1/2 right-8 -translate-y-1/2 z-10 max-w-[260px] pointer-events-none text-right">
    <div className="text-[11px] text-amber-400/80 font-mono tracking-wider mb-1">
      ← START HERE
    </div>
    <div className="text-[12px] text-zinc-400 leading-relaxed">
      Click the{' '}
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 mx-0.5">
        <Plus size={9} />
      </span>
      icon on the target node to begin backtracking. Each expand reveals one
      upstream level to the right.
    </div>
  </div>
);
