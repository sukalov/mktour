import { mdiAccount, mdiAccountGroup, mdiAccountMultiple } from '@mdi/js';
import Icon from '@mdi/react';

interface TypeIconProps {
  // type: 'solo' | 'doubles' | 'team'
  type: string;
  size?: number;
}

export default function TypeIcon({ type, size = 0 }: TypeIconProps) {
  if (type === 'solo') return <Icon path={mdiAccount} className="inline" size={size + .8} />;
  if (type === 'doubles')
    return <Icon path={mdiAccountMultiple} className="inline" size={size + .8} />;
  if (type === 'team') return <Icon path={mdiAccountGroup} className="inline -translate-y-[2px]" size={size + .9} />;
  else return <></>;
}
