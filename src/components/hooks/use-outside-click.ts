import { RefObject, useEffect } from 'react';

const useOutsideClick = (
  handler: () => void,
  ref: RefObject<any>,
  options?: HookOptions,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element | null;

      if (target && target.classList.contains('isolate-touch')) return;
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, {
      capture: options?.capture,
    });
    window.addEventListener(
      options?.touch || 'touchstart',
      handleClickOutside,
      { capture: options?.capture },
    );

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, {
        capture: options?.capture,
      });
      window.removeEventListener(
        options?.touch || 'touchstart',
        handleClickOutside,
        {
          capture: options?.capture,
        },
      );
    };
  }, [handler, options?.capture, options?.touch, ref]);
};

type HookOptions =
  | {
      capture?: boolean;
      touch?: 'touchstart' | 'touchend';
    }
  | undefined;

export default useOutsideClick;
