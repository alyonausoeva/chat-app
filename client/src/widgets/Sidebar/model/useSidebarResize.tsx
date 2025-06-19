import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 200;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 320;
const STORAGE_KEY = 'sidebarWidth';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const useSidebarResize = () => {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const width = stored ? parseInt(stored, 10) : DEFAULT_WIDTH;

    return `${clamp(width, MIN_WIDTH, MAX_WIDTH)}px`;
  });

  const isResizingRef = useRef(false);

  const startResizing = useCallback(() => {
    isResizingRef.current = true;
  }, []);

  const stopResizing = useCallback(() => {
    isResizingRef.current = false;
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const newWidth = clamp(e.clientX, MIN_WIDTH, MAX_WIDTH);

    setSidebarWidth(`${newWidth}px`);
    localStorage.setItem(STORAGE_KEY, newWidth.toString());
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return {
    sidebarWidth,
    setSidebarWidth,
    startResizing,
  };
};
