'use client';
import useOutsideClick from '@/components/hooks/use-outside-click';
import { Button } from '@/components/ui/button';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { useRef, useState } from 'react';

const transition = {
  type: 'spring',
  bounce: 0.15,
  duration: 0.3,
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(() => setIsOpen(false), containerRef);

  return (
    <MotionConfig transition={transition}>
      <div ref={containerRef}>
        <div>
          <motion.div
            animate={{
              // @todo: here I want to remove the width
              width: isOpen ? 200 : '2.5rem',
            }}
            initial={false}
          >
            <div>
              {!isOpen ? (
                <Button
                  className="relative flex aspect-square select-none items-center justify-center p-3 transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => setIsOpen(true)}
                  aria-label="search"
                  variant="ghost"
                >
                  <Search size={20} />
                </Button>
              ) : (
                <div className="flex">
                  <Button
                    className="relative flex aspect-square select-none items-center justify-center p-3 transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                    disabled
                    aria-label="back"
                    variant="ghost"
                  >
                    <Search size={20} />
                  </Button>
                  <div className="w-full">
                    <input
                      className="mt-2 w-full pl-1 pr-2 focus:outline-none"
                      autoFocus
                    />
                    <div className="right-1 top-0 flex h-full items-center justify-center"></div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      className="relative flex aspect-square select-none items-center justify-center p-3 transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => setIsOpen(false)}
                      aria-label="back"
                      variant="ghost"
                    >
                      <ArrowLeft size={20} />
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
