import { useEffect, useRef } from 'react';

const useOnSeen = (handler: () => void) => {
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

  const SeenTrigger = () => (
    <div
      ref={ref}
      className="h-0 w-full -translate-y-[calc(var(--spacing-mk-card-height)+calc((var(--spacing-mk)*2)))]"
    />
  );

  return SeenTrigger;
};

export default useOnSeen;
