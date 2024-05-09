import { turboPascal } from '@/app/fonts';

export default function Mktour() {
  return (
    <div className="h-svh flex flex-auto items-center justify-center">
      <h1
        className={`${turboPascal.className} m-auto select-none text-6xl font-bold`}
      >
        <span>mktour</span>
        <span className="animate-logo-pulse">_</span>
      </h1>
    </div>
  );
}
