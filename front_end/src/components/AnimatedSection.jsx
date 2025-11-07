import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.3
}) => {
  const { ref, isVisible } = useScrollAnimation(0.05);

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 50, opacity: 0 };
      case 'down':
        return { y: -50, opacity: 0 };
      case 'left':
        return { x: -50, opacity: 0 };
      case 'right':
        return { x: 50, opacity: 0 };
      case 'fade':
        return { opacity: 0 };
      default:
        return { y: 50, opacity: 0 };
    }
  };

  const getFinalPosition = () => {
    return { x: 0, y: 0, opacity: 1 };
  };

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={getInitialPosition()}
        animate={isVisible ? getFinalPosition() : getInitialPosition()}
        transition={{
          duration,
          delay,
          ease: [0.2, 0.3, 0.4, 0.8],
          stiffness: 120,
          damping: 20
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AnimatedSection;