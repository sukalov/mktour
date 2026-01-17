'use client';

import Center from '@/components/center';
import LichessSVG from '@/components/icons/lichess-svg';
import GithubLogo from '@/components/ui-custom/github-logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function AboutPage() {
  const { theme } = useTheme();
  const t = useTranslations('About');
  // FIXME edit translations and the page look overall to be less ai-sloppy

  return (
    <Center className="pt-8">
      <div className="max-w-4xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{t('title')}</CardTitle>
            <CardDescription className="text-lg">
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('intro')}</p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('features.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>• {t('features.tournaments')}</li>
                <li>• {t('features.clubs')}</li>
                <li>• {t('features.players')}</li>
                <li>• {t('features.realtime')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('opensource.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                {t('opensource.description')}
              </p>
              <div className="flex gap-4">
                <Link
                  href="https://github.com/sukalov/mktour"
                  target="_blank"
                  className="hover:text-foreground flex items-center gap-2 text-sm"
                >
                  <GithubLogo size="20" theme={theme || 'dark'} />
                  {t('opensource.github')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('contact.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <Link
                href="https://lichess.org/team/mktour"
                target="_blank"
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center">
                  <LichessSVG />
                </div>
                <div>
                  <p className="font-medium">{t('contact.lichess')}</p>
                  <p className="text-muted-foreground text-sm">
                    {t('contact.lichess_desc')}
                  </p>
                </div>
              </Link>
              <Link
                href="https://github.com/sukalov/mktour"
                target="_blank"
                className="flex items-center gap-3"
              >
                <GithubLogo size="24" theme={theme || 'dark'} />
                <div>
                  <p className="font-medium">{t('contact.github')}</p>
                  <p className="text-muted-foreground text-sm">
                    {t('contact.github_desc')}
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Center>
  );
}
