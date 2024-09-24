import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import TypeIcon from '@/components/ui/type-icon';
import { useTranslations } from 'next-intl';

type TypeCardProps = {
  name: 'solo' | 'doubles' | 'team';
  disabled?: boolean;
};

export default function TypeCard({ name, disabled }: TypeCardProps) {
  const t = useTranslations('MakeTournament.Types');
  return (
    <div>
      <RadioGroupItem
        value={name}
        id={name}
        className="peer sr-only"
        disabled={disabled}
      />
      <Label
        htmlFor={name}
        className={`flex h-10 flex-row items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover py-4 text-[0.7rem] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary sm:text-sm [&:has([data-state=checked])]:border-primary`}
      >
        <div className={'items-end align-bottom'}>
          <TypeIcon type={name} />
          &nbsp;
          <span>{t(name)}</span>
        </div>
      </Label>
    </div>
  );
}
