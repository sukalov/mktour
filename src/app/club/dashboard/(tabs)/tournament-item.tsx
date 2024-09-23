'use client';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Format, TournamentType } from '@/types/tournaments';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const TournamentItem = ({
  date,
  format,
  type,
  id,
  title,
}: TournamentItemProps) => {
  const locale = useLocale();
  const localizedDate = new Date(date).toLocaleDateString([locale]);
  const t = useTranslations('MakeTournament');
  const details = [t(`Types.${type}`), t(format), localizedDate];

  const description = details.map((detail, i) => {
    const separator = i === details.length - 1 ? '' : '|';
    return <span key={i}>{`${detail} ${separator}`}</span>;
  });

  return (
    <Link key={id} href={`/tournaments/${id}`} className="flex w-full flex-col">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="flex gap-2">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
const TournamentItemIteratee = (props: TournamentItemProps) => (
  <TournamentItem
    id={props.id}
    title={props.title}
    date={props.date}
    format={props.format}
    type={props.type}
  />
);

interface TournamentItemProps {
  id: string;
  title: string;
  date: string;
  format: Format;
  type: TournamentType;
}

export default TournamentItemIteratee;
