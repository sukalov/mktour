import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { ReactNode } from 'react';

type TypeCardProps = {
  name: string;
  children: ReactNode;
};

export default function TypeCard({ name, children }: TypeCardProps) {
  return (
    <div>
      <RadioGroupItem value={name} id={name} className="peer sr-only" />
      <Label
        htmlFor={name}
        className={`flex h-10 flex-row items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover py-4 text-[0.7rem] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary sm:text-sm [&:has([data-state=checked])]:border-primary`}
      >
        <div className={'font-thin'}>{children}</div>
        <span>{name}</span>
      </Label>
    </div>
  );
}
