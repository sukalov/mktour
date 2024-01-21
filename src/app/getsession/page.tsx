import AuthForm from '@/components/auth/Form';
import { getPageSession } from 'archive/lucia-old';
import { getUserAuth } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getPageSession();
  if (!session) redirect('/sign-in');
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold"> </h1>
      <pre className="overflow-hidden rounded-lg bg-secondary p-4">
        {JSON.stringify(session, null, 2)}
      </pre>
      <AuthForm action="/api/sign-out" />
    </main>
  );
}
