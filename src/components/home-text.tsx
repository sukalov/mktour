'use client';
import '@/styles/cursor.css';
import { useTranslations } from 'next-intl';
import { TypeAnimation } from 'react-type-animation';

export default function HomeText() {
  const cursor = 'custom-cursor';
  const t = useTranslations('Home');
  return (
    <div className="m-auto flex h-full w-full max-w-[min(28rem,99.9%)] flex-auto grow items-center text-[clamp(3rem,8svh,6rem);] leading-none font-extrabold text-balance md:max-w-[min(70rem,90%)] md:text-center md:text-[clamp(5rem,10vw,6rem);]">
      <TypeAnimation
        sequence={[
          `${t('big text 1')}`,
          400,
          `${t('big text 2')}`,
          700,
          (el) => {
            el?.classList.add('cursor-animation');
          },
        ]}
        wrapper="span"
        cursor={false}
        className={cursor}
        repeat={0}
      />
    </div>
  );
}
