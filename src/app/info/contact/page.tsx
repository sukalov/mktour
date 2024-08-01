'use client';

import Center from '@/components/center';
import GithubLogo from '@/components/ui/github-logo';
import LichessLogo from '@/components/ui/lichess-logo';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { FC } from 'react';

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <Center className="pt-8">
      <div className="flex min-w-fit gap-8">
        {Object.values(links).map((link) => (
          <LinkItem key={link.url} link={link} theme={theme || 'dark'} />
        ))}
      </div>
    </Center>
  );
}

const LinkItem: FC<{
  link: (typeof links)[number];
  theme: string;
}> = ({ link, theme }) => {
  return (
    <Link href={link.url} target="_blank" className="flex items-center gap-3">
      <link.logo size="32" theme={theme} />
      <h1 className="text-2xl">{link.title}</h1>
    </Link>
  );
};

const links: Record<string, { title: string; logo: FC<any>; url: string }> = {
  lichess: {
    title: 'lichess',
    logo: LichessLogo,
    url: 'https://lichess.org/team/mktour',
  },
  github: {
    title: 'github',
    logo: GithubLogo,
    url: 'https://github.com/sukalov/mktour',
  },
  // email: {
  //   title: 'email',
  //   logo: Mail,
  //   url: ['matvey10@gmail.com, yatskovanatoly@gmail.com'],
  // },
};
