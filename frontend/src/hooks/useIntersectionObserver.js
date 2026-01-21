import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for intersection observer API
 * Used for scroll animations and lazy loading
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      const isElementIntersecting = entry.isIntersecting;
      setIsIntersecting(isElementIntersecting);
      
      if (isElementIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px',
      ...options,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
};
