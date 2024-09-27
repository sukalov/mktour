import SignInWithLichessButton from '@/components/auth/sign-in-with-lichess-button';
import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

const Page  = async ({ searchParams }: any) => {
  const { user } = await validateRequest();
  if (user) redirect('/');
  return (
    <main className="mx-auto my-4 flex h-[calc(100svh-3.5rem)] w-full max-w-lg flex-auto items-center justify-center p-10">
      <SignInWithLichessButton className="p-10 py-16" from={searchParams.from}/>
    </main>
  );
};

export default Page;
