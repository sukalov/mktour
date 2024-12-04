import { turboPascal } from '@/app/fonts';

export default function Mktour() {
  return (
    <div className="flex h-svh flex-auto items-center justify-center">
      <h1
        className={`${turboPascal.className} m-auto text-6xl font-bold select-none`}
      >
        <span>mktour</span>
        <span className="animate-logo-pulse">_</span>
      </h1>
    </div>
  );
}
