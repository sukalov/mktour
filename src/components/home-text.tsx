'use client';
import '@/styles/cursor.css';
import { TypeAnimation } from 'react-type-animation';

export default function HomeText() {
  const cursor = 'custom-cursor';
  return (
    <div className="m-auto flex h-full w-full max-w-[min(28rem,99.9%)] flex-auto grow items-center text-balance text-[clamp(3rem,8svh,6rem);] font-extrabold leading-none md:max-w-[min(70rem,90%)] md:text-center md:text-[clamp(5rem,10vw,6rem);]">
      <TypeAnimation
        sequence={[
          'chess events',
          400,
          'chess events has become simple for everyone',
          400,
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
