import React from 'react';

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) => {
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        callback();
      }
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, callback]);
};

export default useClickOutside;
