import AuthForm from '@/components/auth/Form';
import { getPageSession } from '@/lib/auth/lucia';
import { getUserAuth } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getPageSession();
  if (!session) redirect('/sign-up');
  return (
    <main className="">
      <h1 className="my-2 text-2xl font-bold">Profile</h1>
      <pre className="mx-8 rounded-lg bg-secondary p-4">
        {JSON.stringify(session, null, 2)}
      </pre>
      <AuthForm action="/api/sign-out" />
    </main>
  );
}
