'use client';

import React, { PropsWithChildren, useRef } from 'react';

interface SwipeDetectorProps {
  onSwipeLeft: () => void | null;
  onSwipeRight: () => void | null;
}

function SwipeDetector({
  onSwipeLeft,
  onSwipeRight,
  children,
}: SwipeDetectorProps & PropsWithChildren) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    event.stopPropagation();
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    event.stopPropagation();
    touchEndX.current = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current && touchEndX.current) {
      const deltaX = touchEndX.current - touchStartX.current;
      if (deltaX > 0) {
        onSwipeRight();
      } else if (deltaX < 0) {
        onSwipeLeft();
      }
    }
    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'manipulation' }} // Optional: Improve touch responsiveness
    >
      {children}
    </div>
  );
}

export default SwipeDetector;
