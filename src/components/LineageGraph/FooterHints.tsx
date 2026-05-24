import React from 'react';
import { Plus } from 'lucide-react';

export const FooterHints: React.FC = () => (
  <div className="px-5 py-2 border-t border-zinc-900 bg-zinc-950/80 flex items-center gap-4 text-[10px] text-zinc-600 font-mono">
    <span>drag to pan</span>
    <span>· scroll to zoom</span>
    <span>
      · click{' '}
      <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700">
        <Plus size={6} />
      </span>{' '}
      to expand upstream
    </span>
    <span>· focus mode = trace single path</span>
  </div>
);
