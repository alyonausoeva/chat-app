import { useEffect, useRef, useState } from 'react';

export const useToggleBar = () => {
  const [isBarOpen, setIsBarOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  const toggleBar = () => {
    setIsBarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setIsBarOpen(false);
      }
    };

    if (isBarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBarOpen]);

  return {
    isBarOpen,
    toggleBar,
    barRef,
  };
};
