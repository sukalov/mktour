'use client';

import { Button } from './ui/button';
import Link from 'next/link';
import { Session } from 'next-auth';

interface ButtonProps {
  slug: string;
  variant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | undefined;
  text: string | undefined;
  session: Session | null;
}

export default function ButtonForAuthorized({
  slug,
  text,
  variant,
  session,
}: ButtonProps) {
  const buttonVariant = variant ?? 'default';
  return (
    <Button
      className="px-2"
      variant={buttonVariant}
      disabled={session === null}
    >
      <Link href={`/${slug}`}>{text}</Link>
    </Button>
  );
}
