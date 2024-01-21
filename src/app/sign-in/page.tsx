import AuthForm from '@/components/auth/Form';
import SignInWithLichessButton from '@/components/sign-in-with-lichess-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPageSession } from '@/lib/auth/lucia';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getPageSession();
  if (session?.user) redirect('/');
  return (
    <main className="mx-auto my-4 flex  h-[calc(100svh-5rem)] w-full max-w-lg flex-auto items-center justify-center p-10">
      <SignInWithLichessButton className="p-10 py-16" />
    </main>
  );
};

export default Page;
