import { useEffect, useRef, useState, useCallback } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const observer = useRef(null);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsVisible(true);
      // Disconnect observer after element becomes visible for better performance
      observer.current?.disconnect();
    }
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin: '50px' // Preload elements slightly before they come into view
    });

    if (ref.current) {
      observer.current.observe(ref.current);
    }

    return () => {
      observer.current?.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
};