import { RefObject, useEffect } from 'react';

const useOutsideClick = (handler: () => void, ref: RefObject<any>) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target)) handler();
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
  }, [handler, ref]);
};

export default useOutsideClick;
