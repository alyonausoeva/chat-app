import { useEffect, useRef, useState } from 'react';
import { Message } from 'shared/types';

export const useScroll = (items: Message[], loadMore: () => void, hasMore: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingMoreRef = useRef(false);
  const prevScrollHeightRef = useRef<number | null>(null);
  const [isFirstMessageVisible, setIsFirstMessageVisible] = useState(false);

  useEffect(() => {
    if (!firstItemRef.current || !containerRef.current) return;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        setIsFirstMessageVisible(entry.isIntersecting);
      },
      {
        root: containerRef.current,
        threshold: 1,
      }
    );

    observer.current.observe(firstItemRef.current);

    return () => observer.current?.disconnect();
  }, [items.length]);

  useEffect(() => {
    if (!loadingMoreRef.current || !containerRef.current || !prevScrollHeightRef.current) return;

    const container = containerRef.current;
    const newScrollHeight = container.scrollHeight;
    const scrollDelta = newScrollHeight - prevScrollHeightRef.current;

    container.scrollTop += scrollDelta;

    loadingMoreRef.current = false;
    prevScrollHeightRef.current = null;
  }, [items]);

  useEffect(() => {
    if (isFirstMessageVisible && hasMore && !loadingMoreRef.current) {
      loadingMoreRef.current = true;
      prevScrollHeightRef.current = containerRef.current?.scrollHeight ?? null;
      loadMore();
    }
  }, [isFirstMessageVisible, hasMore]);

  return { containerRef, firstItemRef };
};
