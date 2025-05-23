import SignInWithLichessButton from '@/components/auth/sign-in-with-lichess-button';
import { publicCaller } from '@/server/api';
import { redirect } from 'next/navigation';

const Page = async (props: { searchParams: Promise<string> }) => {
  const searchParams = await props.searchParams;
  const user = await publicCaller.user.auth();
  if (user) redirect('/');
  return (
    <main className="mx-auto my-4 flex h-[calc(100svh-3.5rem)] w-full max-w-lg flex-auto items-center justify-center p-10">
      <SignInWithLichessButton className="p-10 py-16" from={searchParams} />
    </main>
  );
};

export default Page;
