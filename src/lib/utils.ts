import { clsx, type ClassValue } from 'clsx';
import { customAlphabet } from 'nanoid';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const newid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  8,
);

export function shallowEqual(
  object1: { [key: string]: string | number | undefined | null },
  object2: { [key: string]: string | number | undefined | null },
) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}

export function selectRef(ref: HTMLDivElement) {
  if (!ref) return;
  ref.ontouchstart = (e) => {
    const targetElement = e.target as HTMLElement;
    const isRemoveSelectionButton =
      targetElement.id === 'removeSelection' ||
      targetElement.closest('#removeSelection');

    if (!isRemoveSelectionButton) {
      e.preventDefault();
    }
  };
}
