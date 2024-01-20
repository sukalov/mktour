import { MdGroup, MdGroups, MdPerson } from 'react-icons/md';

interface TypeIconProps {
  // type: 'solo' | 'doubles' | 'team'
  type: string;
  size?: number;
}

export default function TypeIcon({ type, size = 0 }: TypeIconProps) {
  if (type === 'solo') return <MdPerson className="inline" size={size + 14} />;
  if (type === 'doubles')
    return <MdGroup className="inline" size={size + 16} />;
  if (type === 'team') return <MdGroups className="inline" size={size + 19} />;
  else return <></>;
}
