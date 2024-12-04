'use client';
import useOutsideClick from '@/components/hooks/use-outside-click';
import { Button } from '@/components/ui/button';
import { motion, MotionConfig } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useMediaQuery } from 'react-responsive';

const transition = {
  type: 'spring',
  bounce: 0.15,
  duration: 0.3,
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const miniScreen = useMediaQuery({ maxWidth: 495 });
  const microScreen = useMediaQuery({ maxWidth: 395 });
  const mostMicroScreen = useMediaQuery({ maxWidth: 340 });

  useOutsideClick(() => setIsOpen(false), containerRef);
  useHotkeys('meta+k', () => setIsOpen((prev) => !prev), {
    enableOnFormTags: true,
  });

  const searchBarWidth = !miniScreen
    ? 250
    : !microScreen
      ? 200
      : !mostMicroScreen
        ? 150
        : 100;

  return (
    <MotionConfig transition={transition}>
      <div ref={containerRef}>
        <div>
          <motion.div
            animate={{
              width: isOpen ? searchBarWidth : '2.5rem',
            }}
            initial={false}
          >
            <div className="flex flex-row">
              <Button
                className={`relative flex aspect-square items-center justify-center p-2.5 transition-colors select-none disabled:pointer-events-none disabled:opacity-50 ${isOpen && `text-muted-foreground hover:bg-transparent`}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="search"
                variant="ghost"
              >
                <Search size={20} />
              </Button>
              {isOpen && (
                <div className="w-full">
                  <input
                    className="mt-2 w-full bg-transparent pr-2 pl-1 focus:outline-hidden"
                    autoFocus
                  />
                  <div className="top-0 right-1 flex h-full items-center justify-center"></div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
