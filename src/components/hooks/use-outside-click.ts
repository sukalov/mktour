import { RefObject, useEffect } from 'react';

const useOutsideClick = (
  handler: () => void,
  ref: RefObject<HTMLElement | null>,
  options?: HookOptions,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const { target } = event;

      if (
        target instanceof HTMLElement &&
        (target.classList.contains('isolate-touch') ||
          (ref.current && ref.current.contains(target)))
      ) {
        return;
      }

      handler();
    };

    const eventOptions = { capture: options?.capture };
    const touchEvent = options?.touch || 'touchstart';

    document.addEventListener('mousedown', handleClickOutside, eventOptions);
    window.addEventListener(touchEvent, handleClickOutside, eventOptions);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
        eventOptions,
      );
      window.removeEventListener(touchEvent, handleClickOutside, eventOptions);
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
