import { ReactNode } from 'react';

// These tags are available
type Tag = 'p' | 'b' | 'i';

type Props = {
  children(_tags: Record<Tag, (_chunks: ReactNode) => ReactNode>): ReactNode;
};

export default function RichText({ children }: Props) {
  return (
    <div className="prose">
      {children({
        p: (chunks: ReactNode) => <p>{chunks}</p>,
        b: (chunks: ReactNode) => <b className="font-bold">{chunks}</b>,
        i: (chunks: ReactNode) => <i className="italic">{chunks}</i>,
      })}
    </div>
  );
}
