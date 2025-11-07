import { useEffect, useRef } from 'react';

const usePerformanceMonitor = (componentName) => {
  const renderStart = useRef(null);

  useEffect(() => {
    renderStart.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStart.current;
      if (renderTime > 400) {
        console.warn(
          `${componentName} took ${renderTime.toFixed(2)}ms to render, exceeding the Doherty threshold (400ms)`
        );
      }
    };
  });
};

export default usePerformanceMonitor;