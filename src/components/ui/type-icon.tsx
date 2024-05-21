import Icon from "@/components/ui/icon";

interface TypeIconProps {
  type: 'solo' | 'doubles' | 'team';
}

export default function TypeIcon({ type }: TypeIconProps) {
  if (type === 'solo') return <Icon name='person' className="inline -translate-y-[1px]" width={17} height={17} />;
  if (type === 'doubles')
    return <Icon name='group' className="inline -translate-y-[1px]" width={17} height={17}  />;
  if (type === 'team') return <Icon name='groups' className="inline pr-0.5 -translate-y-[2px]" width={26} height={26}  />;
  else return <></>;
}
