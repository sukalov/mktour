import { RefObject, useEffect } from 'react';

const useOutsideClick = (handler: () => void, refs: RefObject<any>[]) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        refs.every((ref) => ref.current && !ref.current.contains(event.target))
      ) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, {
      capture: true,
    });
    window.addEventListener('touchend', handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, {
        capture: true,
      });
      window.removeEventListener('touchend', handleClickOutside, {
        capture: true,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, ...refs.map((ref) => ref.current)]);
};

export default useOutsideClick;
