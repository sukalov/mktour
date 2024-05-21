import { Group, Groups, Person } from "@/components/icons";

interface TypeIconProps {
  type: 'solo' | 'doubles' | 'team';
}

export default function TypeIcon({ type }: TypeIconProps) {
  if (type === 'solo') return <Person className="inline -translate-y-[1px]" width={17} height={17}/>
  if (type === 'doubles')
    return <Group className="inline -translate-y-[1px]" width={17} height={17}  />;
  if (type === 'team') return <Groups className="inline pr-0.5 -translate-y-[2px]" width={26} height={26}  />;
  else return <></>;
}
