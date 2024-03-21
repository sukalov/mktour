import SignInWithLichessButton from '@/components/auth/sign-in-with-lichess-button';
import MakeTournamentButton from '@/components/button-make-tournament';
import HomeText from '@/components/home-text';
import '@/styles/cursor.css';

export default function Unauthorized() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] w-full flex-col gap-8 p-4 pb-8 md:gap-2 md:pb-16">
      <HomeText />
      <div className="m-auto w-full gap-4 flex flex-col items-center md:flex-row md:justify-center">
        <SignInWithLichessButton />
        <MakeTournamentButton />
      </div>
    </div>
  );
}
