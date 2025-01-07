import { LoadingSpinner } from '@/app/loading';
import { Card } from '@/components/ui/card';
import { Result as ResultModel } from '@/types/tournaments';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const Result: FC<ResultProps> = ({ isPending, result, selected }) => {
  const t = useTranslations('Tournament.Results');

  if (isPending) return <LoadingSpinner />;

  if (selected)
    return (
      <div
        className={`select-none ${result && result !== '1/2-1/2' && 'text-muted-foreground'}`}
      >
        {/* <p className="select-none">{t('1/2')}</p> */}
        <small className="select-none">{t('draw')}</small>
      </div>
    );

  if (!result)
    return (
      <Card className="relative grid h-full w-24 min-w-16 grid-cols-2 select-none">
        <div className="flex w-full items-center justify-center" />
        <div className="border-l-muted flex w-full items-center justify-center border-l" />
      </Card>
    );

  const parsedResult = result.split('-');
  const left = parsedResult?.at(0) === '1/2' ? '½' : parsedResult?.at(0);
  const right = parsedResult?.at(1) === '1/2' ? '½' : parsedResult?.at(1);

  return (
    <Card className="grid h-full w-24 min-w-16 grid-cols-2 select-none">
      <div className="flex w-full items-center justify-center opacity-60">
        {left ?? ''}
      </div>
      <div className="border-l-muted flex w-full items-center justify-center border-l opacity-60">
        {right ?? ''}
      </div>
    </Card>
  );
};

export type ResultProps = {
  result: ResultModel | null;
  selected?: boolean;
  isPending?: boolean;
};

export default Result;
