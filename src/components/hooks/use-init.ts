import { useEffect, useState } from 'react';

type CallbackFunction<T extends any[]> = (..._args: T) => void;

const useInit = <T extends any[]>(
  callback: CallbackFunction<T>,
  ...args: T
): [() => void] => {
  const [mounted, setMounted] = useState(false);

  const resetInit = () => setMounted(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      callback(...args);
    }
  }, [mounted, callback, args]);

  return [resetInit];
};

export default useInit;
