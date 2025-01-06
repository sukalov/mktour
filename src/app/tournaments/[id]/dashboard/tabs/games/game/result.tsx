import { Card } from '@/components/ui/card';
import { Result as ResultModel } from '@/types/tournaments';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const Result: FC<ResultProps> = ({
  isPending,
  result,
  selected,
  handleMutate,
}) => {
  const t = useTranslations('Tournament.Results');
  if (isPending) return <Loader2 className="size-5 animate-spin p-0" />;
  if (selected)
    return (
      <div
        className={`select-none ${result && result !== '1/2-1/2' && 'text-muted-foreground'}`}
        onClick={() => handleMutate('1/2-1/2')}
      >
        <small className="select-none">{t('draw')}</small>
      </div>
    );
  if (!result) {
    return (
      <Card className="relative grid h-full w-24 min-w-16 grid-cols-2 select-none">
        <div className="flex w-full items-center justify-center"></div>
        <div className="border-l-muted flex w-full items-center justify-center border-l"></div>
      </Card>
    );
  }
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
  isPending: boolean;
  result: ResultModel | null;
  selected: boolean;
  handleMutate: (_result: ResultModel) => void;
};

export default Result;
