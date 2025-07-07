import { useEffect, useRef } from 'react';

const useScrollableContainer = ({
  setScrolling,
}: UseScrollableContainerProps) => {
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

  return ref;
};

type UseScrollableContainerProps = {
  setScrolling?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default useScrollableContainer;
