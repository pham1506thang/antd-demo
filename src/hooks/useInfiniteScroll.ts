import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export interface UseInfiniteScrollReturn {
  loadMoreRef: (node: HTMLElement | null) => void;
  isIntersecting: boolean;
}

/**
 * Custom hook for infinite scroll using Intersection Observer API
 * @param loadMore - Function to call when intersection is detected
 * @param hasNextPage - Whether there are more pages to load
 * @param loading - Whether currently loading data
 * @param options - Intersection Observer options
 */
export const useInfiniteScroll = (
  loadMore: () => void,
  hasNextPage: boolean,
  loading: boolean,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const { threshold = 0.1, rootMargin = '0px', enabled = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<HTMLElement | null>(null);

  const loadMoreRef = useCallback((node: HTMLElement | null) => {
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Clear previous node
    nodeRef.current = null;

    if (!node || !enabled) return;

    nodeRef.current = node;

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);

        // Load more when intersecting and conditions are met
        if (intersecting && hasNextPage && !loading) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Start observing
    observerRef.current.observe(node);
  }, [loadMore, hasNextPage, loading, threshold, rootMargin, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    loadMoreRef,
    isIntersecting,
  };
};
