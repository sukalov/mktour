import { turboPascal } from '@/app/fonts';

export default function MktourNavbar({ isTournament }: { isTournament: boolean }) {
  return (
    <h1
      className={`${turboPascal.className} m-auto select-none text-2xl font-bold`}
    >
      <span className="group">
        {isTournament ? 'mktour' : 'm'}
        <span className="group-hover:animate-logo-pulse">_</span>
      </span>
    </h1>
  );
}
