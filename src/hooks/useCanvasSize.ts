import { useCallback, useEffect, useState, RefObject } from 'react';
import type { CanvasSize } from '../types/lineage';

export const useCanvasSize = (
  ref: RefObject<HTMLElement | null>,
): CanvasSize => {
  const [size, setSize] = useState<CanvasSize>({ w: 800, h: 600 });

  const measure = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });
  }, [ref]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return size;
};
