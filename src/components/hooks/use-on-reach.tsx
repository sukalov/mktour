import { useEffect, useRef } from 'react';

const useOnReach = (handler: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handler();
        }
      },
      {
        threshold: 0.1, // Trigger when at least 10% visible
      },
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [handler]);

  return ref;
};

export default useOnReach;
