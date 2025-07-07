import { useEffect, useRef, useState } from 'react';

const useScrollableContainer = () => {
  const [scrolling, setScrolling] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!setScrolling) return;

    const node = ref.current;
    if (!node) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setScrolling(false), 300);
    };

    node.addEventListener('scroll', handleScroll);
    return () => {
      node.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [setScrolling]);

  return { ref, scrolling, setScrolling };
};

export default useScrollableContainer;
