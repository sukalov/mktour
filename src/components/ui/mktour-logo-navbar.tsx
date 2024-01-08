import { turboPascal } from '@/app/fonts';

export default function MktourNavbar() {
  return (
    <h1
      className={`${turboPascal.className} m-auto select-none text-2xl font-bold`}
    >
      <span className="group">
        mktour<span className="group-hover:animate-logo-pulse">_</span>
      </span>
    </h1>
  );
}
