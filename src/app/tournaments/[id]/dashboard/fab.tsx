'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2, LucideIcon } from 'lucide-react';
import { FC, MouseEventHandler, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

const Fab: FC<FabProps> = ({
  onClick,
  icon: Icon,
  disabled,
  container,
  className,
}) => {
  return (
    <PortalWrapper container={container}>
      <Button
        className={`pointer-events-auto fixed right-6 bottom-8 z-40 rounded-full ${className} `}
        variant="secondary"
        size="icon"
        style={{ scale: 1.5 }}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className={`h-4 w-4 ${Icon === Loader2 && 'animate-spin'}`} />
      </Button>
    </PortalWrapper>
  );
};

const PortalWrapper: FC<PropsWithChildren & Pick<FabProps, 'container'>> = ({
  children,
  container,
}) => {
  if (container) return createPortal(children, container);
  return children;
};

type FabProps = {
  onClick?: MouseEventHandler;
  icon: LucideIcon;
  disabled?: boolean;
  container?: HTMLElement | null;
  className?: ButtonProps['className'];
};

export default Fab;
