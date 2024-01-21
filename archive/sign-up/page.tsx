import AuthForm from '@/components/auth/Form';
import Link from 'next/link';
import { getPageSession } from 'archive/lucia-old';
import { redirect } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Page = async () => {
  const session = await getPageSession();
  if (session) redirect('/');
  return (
    <main className="mx-auto my-4 max-w-lg bg-secondary p-10">
      <h1 className="text-center text-2xl font-bold">Create an account</h1>
      <AuthForm action="/api/sign-up">
        <Label htmlFor="username" className="text-muted-foreground">
          Username
        </Label>
        <Input name="username" id="username" />
        <br />
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <Input type="password" name="password" id="password" />
        <br />
      </AuthForm>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-secondary-foreground underline">
          Sign in
        </Link>
      </div>
    </main>
  );
};

export default Page;
