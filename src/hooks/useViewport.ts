import { useCallback, useRef, useState, RefObject } from 'react';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  WHEEL_ZOOM_FACTOR,
  ZOOM_STEP,
} from '../constants/lineage';
import type { Viewport } from '../types/lineage';

interface UseViewportReturn {
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  isDragging: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onWheel: (e: React.WheelEvent) => void;
}

export const useViewport = (
  canvasRef: RefObject<HTMLElement | null>,
  initial: Viewport = { x: 0, y: 0, scale: 1 },
): UseViewportReturn => {
  const [viewport, setViewport] = useState<Viewport>(initial);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('[data-node]')) return;
      dragRef.current = {
        isDown: true,
        startX: e.clientX,
        startY: e.clientY,
        origX: viewport.x,
        origY: viewport.y,
      };
      setIsDragging(true);
    },
    [viewport.x, viewport.y],
  );

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current.isDown) return;
    setViewport((v) => ({
      ...v,
      x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
    }));
  }, []);

  const onMouseUp = useCallback(() => {
    dragRef.current.isDown = false;
    setIsDragging(false);
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      setViewport((v) => {
        const delta = -e.deltaY * WHEEL_ZOOM_FACTOR;
        const newScale = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, v.scale * (1 + delta)),
        );
        const ratio = newScale / v.scale;
        return {
          scale: newScale,
          x: cx - (cx - v.x) * ratio,
          y: cy - (cy - v.y) * ratio,
        };
      });
    },
    [canvasRef],
  );

  const zoomIn = useCallback(
    () =>
      setViewport((v) => ({
        ...v,
        scale: Math.min(MAX_ZOOM, v.scale * ZOOM_STEP),
      })),
    [],
  );

  const zoomOut = useCallback(
    () =>
      setViewport((v) => ({
        ...v,
        scale: Math.max(MIN_ZOOM, v.scale / ZOOM_STEP),
      })),
    [],
  );

  return {
    viewport,
    setViewport,
    isDragging,
    zoomIn,
    zoomOut,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  };
};
