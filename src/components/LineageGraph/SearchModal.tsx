import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { TRANSFORM_KINDS } from '../../constants/lineage';
import type { LineageMap, LineageNode } from '../../types/lineage';

interface SearchModalProps {
  open: boolean;
  lineage: LineageMap;
  onClose: () => void;
  onPick: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  open,
  lineage,
  onClose,
  onPick,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo<LineageNode[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return Object.values(lineage)
      .filter(
        (n) =>
          n.name.toLowerCase().includes(q) || n.table.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [query, lineage]);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm"
      onClick={() => {
        setQuery('');
        onClose();
      }}
    >
      <div
        className="w-[480px] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.9)' }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
          <Search size={15} className="text-zinc-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setQuery('');
                onClose();
              }
            }}
            placeholder="Search columns or tables…"
            className="flex-1 bg-transparent outline-none text-[13px] text-zinc-100 placeholder-zinc-600 font-mono"
          />
          <kbd className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            ESC
          </kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-[12px] text-zinc-600 text-center font-mono">
              {query ? 'No matches' : 'Start typing to search…'}
            </div>
          ) : (
            results.map((n) => {
              const k = TRANSFORM_KINDS[n.type];
              const sat = k.sat === 0 ? 0 : 70;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setQuery('');
                    onPick(n.id);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 border-b border-zinc-900 last:border-0 flex items-center gap-3"
                >
                  <span
                    className="text-[8px] font-semibold tracking-wider px-1 py-px rounded shrink-0"
                    style={{
                      background: `hsl(${k.hue},${sat}%,15%)`,
                      color: `hsl(${k.hue},${sat}%,70%)`,
                    }}
                  >
                    {k.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[12.5px] text-zinc-200 truncate">
                      {n.name}
                    </div>
                    <div className="text-[10.5px] text-zinc-500 font-mono truncate">
                      {n.table}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
