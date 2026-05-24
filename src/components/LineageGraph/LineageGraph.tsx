import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NODE_H, NODE_W } from '../../constants/lineage';
import { useCanvasSize } from '../../hooks/useCanvasSize';
import { useGoogleFonts } from '../../hooks/useGoogleFonts';
import { useViewport } from '../../hooks/useViewport';
import { useLineage } from '../../store/LineageContext';
import { Edges } from './Edges';
import { EmptyHint } from './EmptyHint';
import { FooterHints } from './FooterHints';
import { Minimap } from './Minimap';
import { Node } from './Node';
import { SearchModal } from './SearchModal';
import { SidePanel } from './SidePanel';
import { TopBar } from './TopBar';

export const LineageGraph: React.FC = () => {
  useGoogleFonts();

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasSize = useCanvasSize(canvasRef);
  const {
    lineage,
    expanded,
    selectedId,
    focusMode,
    positions,
    focusSet,
    visibleNodeIds,
    totalNodes,
    setSelectedId,
    setFocusMode,
    toggleNode,
    expandFullUpstream,
    collapseAll,
    addExpanded,
  } = useLineage();

  const {
    viewport,
    setViewport,
    isDragging,
    zoomIn,
    zoomOut,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  } = useViewport(canvasRef);

  const [searchOpen, setSearchOpen] = useState(false);
  const didInitialCenter = useRef(false);

  // Center target on first render once canvas size is known.
  // Mirrored layout: target sits at world (0,0), so place viewport offset
  // 80px from the left edge to keep the target visible on the left.
  useEffect(() => {
    if (didInitialCenter.current) return;
    if (!canvasSize.w || !canvasSize.h) return;
    setViewport({
      x: 80,
      y: canvasSize.h / 2 - NODE_H / 2,
      scale: 1,
    });
    didInitialCenter.current = true;
  }, [canvasSize.w, canvasSize.h, setViewport]);

  // Cmd/Ctrl + K to open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const jumpToNode = useCallback(
    (id: string) => {
      setSelectedId(id);
      const pos = positions[id];
      if (!pos) return;
      setViewport((v) => ({
        ...v,
        x: canvasSize.w / 2 - (pos.x + NODE_W / 2) * v.scale,
        y: canvasSize.h / 2 - (pos.y + NODE_H / 2) * v.scale,
      }));
    },
    [positions, canvasSize.w, canvasSize.h, setSelectedId, setViewport],
  );

  const resetView = useCallback(() => {
    collapseAll();
    setViewport({
      x: 80,
      y: canvasSize.h / 2 - NODE_H / 2,
      scale: 1,
    });
  }, [collapseAll, canvasSize.h, setViewport]);

  const handleJumpFromPanel = useCallback(
    (id: string) => {
      if (selectedId) addExpanded(selectedId);
      jumpToNode(id);
    },
    [selectedId, addExpanded, jumpToNode],
  );

  const handleSearchPick = useCallback(
    (id: string) => {
      setSearchOpen(false);
      expandFullUpstream(id);
      setTimeout(() => jumpToNode(id), 50);
    },
    [expandFullUpstream, jumpToNode],
  );

  return (
    <div
      className="w-full h-screen flex flex-col text-zinc-100 overflow-hidden"
      style={{
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        background: 'radial-gradient(ellipse at top, #0a0a0d 0%, #050507 100%)',
      }}
    >
      <TopBar
        visibleCount={visibleNodeIds.length}
        totalCount={totalNodes}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode((f) => !f)}
        onOpenSearch={() => setSearchOpen(true)}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
      />

      <div
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        className="flex-1 relative overflow-hidden"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundImage: `radial-gradient(circle, #1c1c20 1px, transparent 1px)`,
          backgroundSize: `${24 * viewport.scale}px ${24 * viewport.scale}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        }}
      >
        {expanded.size === 0 && <EmptyHint />}

        <div
          style={{
            position: 'absolute',
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          <Edges
            positions={positions}
            lineage={lineage}
            expanded={expanded}
            focusSet={focusSet}
          />
          {visibleNodeIds.map((id) => {
            const node = lineage[id];
            const pos = positions[id];
            const isExpanded = expanded.has(id);
            const isFocused = focusSet ? focusSet.has(id) : false;
            const isDimmed = focusSet ? !focusSet.has(id) : false;
            return (
              <div key={id} data-node>
                <Node
                  node={node}
                  pos={pos}
                  isExpanded={isExpanded}
                  isFocused={isFocused}
                  isDimmed={isDimmed}
                  isSelected={selectedId === id}
                  hasParents={node.parents.length > 0}
                  onToggle={toggleNode}
                  onSelect={setSelectedId}
                />
              </div>
            );
          })}
        </div>

        <SidePanel
          selectedId={selectedId}
          lineage={lineage}
          onClose={() => setSelectedId(null)}
          onExpandPath={expandFullUpstream}
          onJump={handleJumpFromPanel}
        />

        <Minimap
          positions={positions}
          viewport={viewport}
          canvasSize={canvasSize}
          lineage={lineage}
        />

        <div className="absolute bottom-4 left-4 px-2 py-1 rounded-md bg-zinc-950/90 border border-zinc-800 text-[10px] text-zinc-500 font-mono">
          {Math.round(viewport.scale * 100)}%
        </div>

        <SearchModal
          open={searchOpen}
          lineage={lineage}
          onClose={() => setSearchOpen(false)}
          onPick={handleSearchPick}
        />
      </div>

      <FooterHints />
    </div>
  );
};
