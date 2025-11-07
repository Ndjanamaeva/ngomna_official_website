import React, { useEffect, useRef, useState } from 'react';

const ScrollProgress = ({ thickness = 8, right = 12, colorStart = '#10B981', colorEnd = '#059669' }) => {
  const barRef = useRef(null);
  const containerRef = useRef(null);
  const rAF = useRef(null);
  const [headerOffset, setHeaderOffset] = useState(0);

  useEffect(() => {
    // Measure header height (if header exists) and set top offset so the bar starts below it
    const headerEl = document.querySelector('header');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
    setHeaderOffset(headerHeight);
    if (containerRef.current) {
      containerRef.current.style.top = `${headerHeight}px`;
    }

    const update = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollable = Math.max(docHeight - winHeight, 1);
      const progress = Math.min(1, Math.max(0, scrollTop / scrollable));

      if (barRef.current) {
        barRef.current.style.transform = `scaleY(${progress})`;
        barRef.current.style.transformOrigin = 'top';
        barRef.current.setAttribute('aria-valuenow', Math.round(progress * 100).toString());
      }
    };

    const onScroll = () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
      rAF.current = requestAnimationFrame(update);
    };

    // Initialize
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-progress"
      style={{
        right: `${right}px`,
        width: `${thickness}px`,
        top: headerOffset ? `${headerOffset}px` : undefined
      }}
      aria-hidden={false}
    >
      <div
        className="scroll-progress__track"
        aria-hidden="true"
      >
        <div
          ref={barRef}
          className="scroll-progress__bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
          style={{ background: `linear-gradient(180deg, ${colorStart}, ${colorEnd})` }}
        />
      </div>
    </div>
  );
};

export default ScrollProgress;
