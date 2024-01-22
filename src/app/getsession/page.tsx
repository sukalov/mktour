import AuthForm from '@/components/auth/form';
import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { user, session } = await validateRequest();
  if (!session) redirect('/sign-in');
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold"> </h1>
      <pre className="overflow-hidden rounded-lg bg-secondary p-4">
        {JSON.stringify({user, session}, null, 2)}
      </pre>
      <AuthForm action="/api/sign-out" />
    </main>
  );
}
